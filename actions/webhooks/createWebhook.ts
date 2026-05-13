import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Create Webhook
const inputSchema = {
  endpoint: {
    name: "Endpoint",
    description: "The webhook endpoint URL",
    type: "string",
    required: true,
  },
  events: {
    name: "Events",
    description: "Array of webhook event types to listen for",
    type: {
      type: "array",
      description:
        "See [documentation](doc:webhooks#task-webhooks) for available event options. Use `*` to subscribe to all events.",
      items: {
        type: "string",
      },
    },
    required: true,
  },
  folder_id: {
    name: "Folder ID",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
  list_id: {
    name: "List ID",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
  space_id: {
    name: "Space ID",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
  task_id: {
    name: "Task ID",
    description: "",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Create Webhook
const outputSchema = {
  required: ["id", "webhook"],
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    webhook: {
      required: [
        "id",
        "userid",
        "team_id",
        "endpoint",
        "client_id",
        "events",
        "task_id",
        "list_id",
        "folder_id",
        "space_id",
        "health",
        "secret",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        userid: {
          type: "integer",
        },
        team_id: {
          type: "integer",
        },
        endpoint: {
          type: "string",
        },
        client_id: {
          type: "string",
        },
        events: {
          type: "array",
          items: {
            type: "string",
          },
        },
        task_id: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        list_id: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        folder_id: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        space_id: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        health: {
          required: ["status", "fail_count"],
          type: "object",
          properties: {
            status: {
              type: "string",
            },
            fail_count: {
              type: "integer",
            },
          },
          additionalProperties: true,
        },
        secret: {
          type: "string",
        },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Create Webhook",
  description: "Creates create webhook in ClickUp",
  category: "Webhooks",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/webhook`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            {
              method: "POST",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
