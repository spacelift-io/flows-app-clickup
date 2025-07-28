import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Webhooks
const inputSchema = {} as Record<string, AppBlockConfigField>;

// Output schema for List Webhooks
const outputSchema = {
  required: ["webhooks"],
  type: "object",
  properties: {
    webhooks: {
      type: "array",
      items: {
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
  },
} as Type;

export default {
  name: "List Webhooks",
  description: "Retrieves list webhooks in ClickUp",
  category: "Webhooks",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const endpoint = `/v2/team/${input.app.signals.teamId}/webhook`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            { method: "GET" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
