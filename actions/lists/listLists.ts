import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Lists
const inputSchema = {
  folder_id: {
    name: "Folder ID",
    description: "",
    type: "number",
    required: true,
  },
  archived: {
    name: "Archived",
    description: "Whether to include archived items",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for List Lists
const outputSchema = {
  required: ["lists"],
  type: "object",
  properties: {
    lists: {
      type: "array",
      items: {
        required: [
          "id",
          "name",
          "orderindex",
          "content",
          "status",
          "priority",
          "assignee",
          "task_count",
          "due_date",
          "start_date",
          "folder",
          "space",
          "archived",
          "override_statuses",
          "permission_level",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          orderindex: {
            type: "integer",
          },
          content: {
            type: "string",
          },
          status: {
            oneOf: [
              {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                  },
                  color: {
                    type: "string",
                  },
                  hide_label: {
                    type: "boolean",
                  },
                },
              },
              {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              {},
            ],
          },
          priority: {
            oneOf: [
              {
                type: "object",
                properties: {
                  priority: {
                    type: "string",
                  },
                  color: {
                    type: "string",
                  },
                },
              },
              {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              {},
            ],
          },
          assignee: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          task_count: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          due_date: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          start_date: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          folder: {
            required: ["id", "name", "hidden", "access"],
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              hidden: {
                type: "boolean",
              },
              access: {
                type: "boolean",
              },
            },
          },
          space: {
            required: ["id", "name", "access"],
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              access: {
                type: "boolean",
              },
            },
          },
          archived: {
            type: "boolean",
          },
          override_statuses: {
            type: "boolean",
          },
          permission_level: {
            type: "string",
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "List Lists",
  description: "Retrieves list lists in ClickUp",
  category: "Lists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { folder_id } = input.event.inputConfig;
        const endpoint = `/v2/folder/${folder_id}/list`;

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
