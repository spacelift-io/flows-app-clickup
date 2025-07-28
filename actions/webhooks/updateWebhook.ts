import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Update Webhook
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
    type: "string",
    required: true,
  },
  status: {
    name: "Status",
    description: "The status of the item",
    type: "string",
    required: true,
  },
  webhook_id: {
    name: "Webhook ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Webhook
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
        },
        secret: {
          type: "string",
        },
      },
    },
  },
} as Type;

export default {
  name: "Update Webhook",
  description: "Updates update webhook in ClickUp",
  category: "Webhooks",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { webhook_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/webhook/${webhook_id}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            {
              method: "PUT",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
