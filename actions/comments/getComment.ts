import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Comment
const inputSchema = {
  comment_id: {
    name: "Comment ID",
    description: "",
    type: "number",
    required: true,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by its custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Get Comment
const outputSchema = {
  required: ["comments"],
  type: "object",
  properties: {
    comments: {
      type: "array",
      items: {
        required: [
          "id",
          "comment",
          "comment_text",
          "user",
          "resolved",
          "assignee",
          "assigned_by",
          "reactions",
          "date",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          comment: {
            type: "array",
            items: {
              required: ["text"],
              type: "object",
              properties: {
                text: {
                  type: "string",
                },
              },
              additionalProperties: true,
            },
          },
          comment_text: {
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
            additionalProperties: true,
          },
          resolved: {
            type: "boolean",
          },
          assignee: {
            required: [
              "id",
              "username",
              "email",
              "color",
              "initials",
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
              email: {
                type: "string",
              },
              color: {
                type: "string",
              },
              initials: {
                type: "string",
              },
              profilePicture: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          assigned_by: {
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
            additionalProperties: true,
          },
          reactions: {
            type: "array",
            items: {
              type: "string",
            },
          },
          date: {
            type: "string",
          },
          reply_count: {
            type: "string",
            description: "For threaded comments, `reply_count` is always 0.",
          },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Get Comment",
  description: "Retrieves get comment in ClickUp",
  category: "Comments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { comment_id, custom_task_ids } = input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/comment/${comment_id}/reply?${queryString}`
          : `/v2/comment/${comment_id}/reply`;

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
