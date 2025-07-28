import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Time Entry
const inputSchema = {
  timer_id: {
    name: "Timer ID",
    description: "Array of timer ids to delete separated by commas",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Delete Time Entry
const outputSchema = {
  required: ["data"],
  type: "object",
  properties: {
    data: {
      required: [
        "id",
        "task",
        "wid",
        "user",
        "billable",
        "start",
        "end",
        "duration",
        "description",
        "tags",
        "source",
        "at",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        task: {
          required: ["id", "name", "status", "custom_type"],
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            status: {
              required: ["status", "color", "orderindex", "type"],
              type: "object",
              properties: {
                status: {
                  type: "string",
                },
                color: {
                  type: "string",
                },
                orderindex: {
                  type: "integer",
                },
                type: {
                  type: "string",
                },
              },
            },
            custom_type: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
          },
        },
        wid: {
          type: "string",
        },
        user: {
          required: [
            "id",
            "username",
            "initials",
            "email",
            "color",
            "profilePicture",
          ],
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            username: {
              type: "string",
            },
            initials: {
              type: "string",
            },
            email: {
              type: "string",
            },
            color: {
              type: "string",
            },
            profilePicture: {
              type: "string",
            },
          },
        },
        billable: {
          type: "boolean",
        },
        start: {
          type: "string",
        },
        end: {
          type: "integer",
        },
        duration: {
          type: "integer",
        },
        description: {
          type: "string",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
        },
        source: {
          type: "string",
        },
        at: {
          type: "integer",
        },
      },
    },
  },
} as Type;

export default {
  name: "Delete Time Entry",
  description: "Deletes delete time entry in ClickUp",
  category: "Time Tracking",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { timer_id } = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/time_entries/${timer_id}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            { method: "DELETE" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
