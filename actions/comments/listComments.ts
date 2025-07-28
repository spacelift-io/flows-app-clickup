import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Comments
const inputSchema = {
  task_id: {
    name: "Task ID",
    description: "",
    type: "string",
    required: true,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by it's custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
  start: {
    name: "Start",
    description: "The start time in Unix timestamp format",
    type: "number",
    required: false,
  },
  start_id: {
    name: "Start ID",
    description: "Enter the Comment `id` of a task comment.",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for List Comments
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
      },
    },
  },
} as Type;

export default {
  name: "List Comments",
  description: "Retrieves list comments in ClickUp",
  category: "Comments",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { task_id, custom_task_ids } = input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/task/${task_id}/comment?${queryString}`
          : `/v2/task/${task_id}/comment`;

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
