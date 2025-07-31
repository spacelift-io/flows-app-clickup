import {
  defineApp,
  blocks,
  messaging,
  http,
  kv,
  lifecycle,
  AppInput,
  AppLifecycleCallbackOutput,
} from "@slflows/sdk/v1";
import { verifyClickUpWebhook } from "./security.ts";
import { getAccessToken, makeClickUpApiRequest } from "./utils/apiHelpers.ts";
import {
  isValidWebhookPayload,
  isSupportedEventType,
} from "./utils/webhookHandlers.ts";

// Import organized block collections
import { subscriptions } from "./subscriptions/index.ts";
import { actions } from "./actions/index.ts";

const authorizationPromptKey = "authorization";

export const app = defineApp({
  name: "ClickUp",
  installationInstructions: `
To connect your ClickUp account:

1. **Create OAuth App**: Create a new [OAuth app](https://app.clickup.com/settings/apps) in ClickUp
2. **Set Redirect URI**: Use <copyable>[this URL]({appEndpointUrl}/auth/callback)</copyable> as the redirect URL
3. **Configure**: Enter your Client ID and Client Secret below
4. **Authorize**: Click the authorization link that appears after sync
  `.trim(),

  blocks: {
    ...actions,
    ...subscriptions,
  },

  config: {
    clientId: {
      name: "Client ID",
      description: "Your ClickUp OAuth app Client ID",
      type: "string",
      required: true,
      fixed: true,
    },
    clientSecret: {
      name: "Client Secret",
      description: "Your ClickUp OAuth app Client Secret",
      type: "string",
      required: true,
      fixed: false,
      sensitive: true,
    },
  },

  signals: {
    accessToken: {
      name: "Access Token",
      description: "OAuth access token for ClickUp API",
      sensitive: true,
    },
    clientSecret: {
      name: "Client Secret",
      description: "Client Secret used for ClickUp OAuth",
      sensitive: true,
    },
    teamId: {
      name: "Team ID",
      description:
        "ID of the ClickUp team (workspace) this app is installed in",
    },
    webhookId: {
      name: "Webhook ID",
      description: "ID of the ClickUp webhook for this app",
    },
    webhookSecret: {
      name: "Webhook Secret",
      description: "Secret used to verify ClickUp webhooks",
      sensitive: true,
    },
  },

  async onSync(input: AppInput): Promise<AppLifecycleCallbackOutput> {
    // Determine current installation state
    const { state, data } = await determineInstallationState(input);

    // Route to appropriate handler based on state
    switch (state) {
      case InstallState.READY: // no-op happy path.
        return { newStatus: "ready" };

      case InstallState.CONFIG_CHANGED:
        return handleConfigChange(input);

      case InstallState.NEEDS_AUTH:
        return handleAuthCreation(input);

      case InstallState.AWAITING_USER_AUTH:
        return {};

      case InstallState.NEEDS_WEBHOOK_SETUP:
        return handleWebhookSetup(input, data.accessToken);

      default:
        return {
          newStatus: "failed",
          customStatusDescription: "An unknown error occurred during setup.",
        };
    }
  },

  async onDrain(input: AppInput) {
    const { webhookId, accessToken } = input.app.signals;

    if (webhookId && accessToken) {
      try {
        // Attempt to delete the ClickUp webhook. If it fails, we've at least tried.
        await makeClickUpApiRequest(accessToken, `/v2/webhook/${webhookId}`, {
          method: "DELETE",
        });
      } catch {
        // Don't bother writing to logs or anything, we're deleting the app
        // anyway so who will see it?
      }
    }

    return { newStatus: "drained" };
  },

  http: {
    onRequest: async ({ request, app }: any) => {
      if (request.path === "/auth/start") {
        return await handleOAuthStart({ request, app });
      }

      if (request.path === "/auth/callback") {
        return await handleOAuthCallback({ request, app });
      }

      return await handleWebhook({ request, app });
    },
  },
});

// Installation states for clear state machine logic
enum InstallState {
  READY = "ready",
  CONFIG_CHANGED = "config_changed",
  NEEDS_AUTH = "needs_auth",
  AWAITING_USER_AUTH = "awaiting_user_auth",
  NEEDS_WEBHOOK_SETUP = "needs_webhook_setup",
}

// Helper function to determine current installation state
async function determineInstallationState(
  input: AppInput,
): Promise<{ state: InstallState; data: any }> {
  const { config, signals } = input.app;
  const { clientSecret } = config;

  // 1. Config Changed - destructive action, check early
  if (signals?.clientSecret && signals.clientSecret !== clientSecret) {
    return { state: InstallState.CONFIG_CHANGED, data: {} };
  }

  // --- KV-First Checks for In-Progress Operations ---

  // 2. Awaiting User Auth (Prompt exists, but no token yet)
  if (authorizationPromptKey in input.app.prompts) {
    return { state: InstallState.AWAITING_USER_AUTH, data: {} };
  }

  // --- Signal-Based Checks for Stable States ---

  // 3. Ready State (Happy Path) - both access token and webhook in signals
  if (signals?.accessToken && signals?.webhookId) {
    return { state: InstallState.READY, data: {} };
  }

  // 4. Needs Webhook Setup - has access token but missing webhookId
  const accessToken =
    signals?.accessToken || (await kv.app.get("access_token"))?.value;
  if (accessToken && !signals?.webhookId) {
    return { state: InstallState.NEEDS_WEBHOOK_SETUP, data: { accessToken } };
  }

  // 5. Needs Auth (Default initial state)
  return { state: InstallState.NEEDS_AUTH, data: {} };
}

// Handler for config change scenario
async function handleConfigChange(
  input: any,
): Promise<AppLifecycleCallbackOutput> {
  console.log("Config changed, resetting auth");

  // 1. Clean up existing auth prompt if any
  if (authorizationPromptKey in input.app.prompts) {
    await lifecycle.prompt.delete(authorizationPromptKey);
  }

  // 2. Clean up all transient KV state to force fresh start
  await kv.app.delete(["access_token", "oauth_complete", "oauth_state"]);

  // 3. Trigger fresh auth creation
  return handleAuthCreation(input);
}

// Handler for creating new auth prompt
async function handleAuthCreation(
  input: any,
): Promise<AppLifecycleCallbackOutput> {
  const url = `${input.app.http.url}/auth/start`;
  await lifecycle.prompt.create(
    authorizationPromptKey,
    "Click to authorize with ClickUp",
    { redirect: { url, method: "GET" } },
  );

  return {
    newStatus: "in_progress",
    customStatusDescription: "⚠️ Proceed with ClickUp authorization",
    signalUpdates: { accessToken: null },
  };
}

// Handler for webhook setup after OAuth completion
async function handleWebhookSetup(
  input: any,
  accessToken: string,
): Promise<AppLifecycleCallbackOutput> {
  try {
    const { teams } = await makeClickUpApiRequest(accessToken, "/v2/team");

    if (teams.length !== 1) {
      return {
        newStatus: "failed",
        customStatusDescription: `Unexpected number of authorized teams - ${teams.length}.`,
      };
    }

    const teamId = teams[0].id;

    const { webhook } = await makeClickUpApiRequest(
      accessToken,
      `/v2/team/${teamId}/webhook`,
      {
        method: "POST",
        body: {
          endpoint: `${input.app.http.url}/`,
          events: [
            "taskCreated",
            "taskUpdated",
            "taskDeleted",
            "taskCommentPosted",
            "taskCommentUpdated",
            "taskTimeTrackedUpdated",
            "listCreated",
            "listUpdated",
            "listDeleted",
            "folderCreated",
            "folderUpdated",
            "folderDeleted",
            "spaceCreated",
            "spaceUpdated",
            "spaceDeleted",
            "goalCreated",
            "goalUpdated",
            "goalDeleted",
            "taskPriorityUpdated",
            "taskStatusUpdated",
            "taskAssigneeUpdated",
            "taskDueDateUpdated",
            "taskTagUpdated",
            "taskMoved",
            "taskTimeEstimateUpdated",
            "keyResultCreated",
            "keyResultUpdated",
            "keyResultDeleted",
          ],
        },
      },
    );

    // Clean up all transient KV values now that setup is complete
    await kv.app.delete(["oauth_complete"]);

    return {
      newStatus: "ready",
      signalUpdates: {
        accessToken: accessToken,
        clientSecret: input.app.config.clientSecret,
        teamId: teamId,
        webhookId: webhook.id,
        webhookSecret: webhook.secret,
      },
    };
  } catch (error) {
    console.error("Webhook setup failed: ", error);
    return {
      newStatus: "failed",
      customStatusDescription:
        "Failed to create webhook. Please try syncing again.",
    };
  }
}

// HTTP Handler Functions
async function handleOAuthStart({ request, app }: any) {
  const { clientId } = app.config;
  const redirectUri = `${app.http.url}/auth/callback`;
  const state = crypto.randomUUID();

  await kv.app.set({ key: "oauth_state", value: state });

  const authUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  await http.respond(request.requestId, {
    statusCode: 302,
    headers: { Location: authUrl },
  });
}

async function handleOAuthCallback({ request, app }: any) {
  const { code, state } = request.query || {};
  const { clientId, clientSecret } = app.config;

  const storedState = await kv.app.get("oauth_state");
  if (state !== storedState?.value) {
    await http.respond(request.requestId, {
      statusCode: 400,
      headers: { "Content-Type": "text/html" },
      body: "<h1>Error</h1><p>Invalid state parameter. Please try again.</p>",
    });
    return;
  }

  try {
    const tokenResponse = await getAccessToken(
      "https://api.clickup.com/api",
      clientId,
      clientSecret,
      code,
    );

    if (!tokenResponse.access_token) {
      throw new Error("No access token in response");
    }

    // Store access token and mark OAuth complete
    await kv.app.setMany([
      { key: "access_token", value: tokenResponse.access_token },
      { key: "oauth_complete", value: true },
      { key: "oauth_state", value: null, ttl: 0 }, // delete
    ]);

    // Delete the auth prompt immediately after successful OAuth
    if (authorizationPromptKey in app.prompts) {
      await lifecycle.prompt.delete(authorizationPromptKey);
    }

    // Always redirect to app installation URL
    await http.respond(request.requestId, {
      statusCode: 302,
      headers: { Location: app.installationUrl },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    await http.respond(request.requestId, {
      statusCode: 400,
      headers: { "Content-Type": "text/html" },
      body: `<h1>Authorization Failed</h1>
             <p><strong>Error:</strong> ${errorMessage}</p>
             <p><strong>Details:</strong> Check server logs for more information</p>
             <p>Please try the authorization process again.</p>`,
    });
  }
}

async function handleWebhook({ request, app }: any) {
  if (request.path !== "/") {
    await http.respond(request.requestId, {
      statusCode: 404,
      body: { error: "Not found" },
    });
    return;
  }

  if (request.method !== "POST") {
    await http.respond(request.requestId, {
      statusCode: 405,
      body: { error: "Method not allowed" },
    });
    return;
  }

  try {
    // Extract webhook signature from headers
    const signature =
      request.headers["X-Signature"] || request.headers["x-signature"];

    if (!signature) {
      await http.respond(request.requestId, {
        statusCode: 400,
        body: {
          error: "Missing required webhook header (X-Signature)",
        },
      });
      return;
    }

    const webhookSecret = app.signals.webhookSecret;

    if (!webhookSecret) {
      await http.respond(request.requestId, {
        statusCode: 400,
        body: {
          error: "Webhook secret not configured - please sync the app first",
        },
      });
      return;
    }

    // Verify webhook signature
    const verification = verifyClickUpWebhook(
      signature,
      request.rawBody,
      webhookSecret,
    );

    if (!verification.isValid) {
      await http.respond(request.requestId, {
        statusCode: 401,
        body: { error: `Webhook verification failed: ${verification.error}` },
      });
      return;
    }

    // Validate payload structure
    if (!isValidWebhookPayload(request.body)) {
      await http.respond(request.requestId, {
        statusCode: 400,
        body: { error: "Invalid webhook payload structure" },
      });
      return;
    }

    const payload = request.body;
    const eventType = payload.event;

    console.log("Webhook event received: ", eventType);

    // Check if we support this event type
    if (!isSupportedEventType(eventType)) {
      await http.respond(request.requestId, {
        statusCode: 200,
        body: { message: "Event type not supported", eventType },
      });
      return;
    }

    // Find subscription blocks for this event type (blockTypeId = eventType)
    const listOutput = await blocks.list({
      typeIds: [eventType],
    });

    if (listOutput.blocks.length !== 0) {
      try {
        // Send webhook payload to subscription blocks
        await messaging.sendToBlocks({
          body: { headers: request.headers, payload: payload },
          blockIds: listOutput.blocks.map((block: any) => block.id),
        });
      } catch (messagingError) {
        console.error("Failed to send to blocks:", messagingError);
        // Continue to respond to ClickUp even if messaging fails
      }
    }

    // Always respond to ClickUp
    await http.respond(request.requestId, {
      statusCode: 200,
      body: {
        message: "ok",
        eventType,
        blocksNotified: listOutput.blocks.length,
      },
    });
  } catch (error) {
    console.error("ClickUp webhook error:", error);
    await http.respond(request.requestId, {
      statusCode: 500,
      body: { error: `Internal server error: ${(error as Error).message}` },
    });
  }
}
