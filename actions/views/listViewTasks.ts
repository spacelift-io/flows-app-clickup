import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List View Tasks
const inputSchema = {
  page: {
    name: "Page",
    description: "Page number for pagination",
    type: "number",
    required: true,
  },
  view_id: {
    name: "View ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for List View Tasks
const outputSchema = {
  required: ["tasks", "last_page"],
  type: "object",
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          custom_item_id: {
            anyOf: [
              {
                type: "number",
              },
              {
                type: "null",
              },
            ],
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
          markdown_description: {
            type: "string",
          },
          orderindex: {
            type: "string",
          },
          date_created: {
            type: "string",
          },
          date_updated: {
            type: "string",
          },
          date_closed: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          date_done: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          creator: {
            required: ["id", "username", "color", "profilePicture"],
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              username: {
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
          assignees: {
            type: "array",
            items: {
              type: "string",
            },
          },
          watchers: {
            type: "array",
            items: {
              type: "string",
            },
          },
          checklists: {
            type: "array",
            items: {
              type: "string",
            },
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
          },
          parent: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          priority: {
            properties: {
              color: {
                type: "string",
              },
              id: {
                type: "string",
              },
              orderindex: {
                type: "string",
              },
              priority: {
                type: "string",
              },
            },
            anyOf: [
              {
                type: "object",
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
          points: {
            anyOf: [
              {
                type: "number",
              },
            ],
          },
          time_estimate: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          custom_fields: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              type: {
                type: "string",
              },
              type_config: {
                type: "object",
                properties: {
                  single_user: {
                    type: "boolean",
                  },
                  include_groups: {
                    type: "boolean",
                  },
                  include_guests: {
                    type: "boolean",
                  },
                  include_team_members: {
                    type: "boolean",
                  },
                },
              },
              date_created: {
                type: "string",
              },
              hide_from_guests: {
                type: "boolean",
              },
              value: {
                anyOf: [
                  {
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
                  {
                    type: "string",
                    description: "Simple text value for custom field",
                  },
                ],
              },
              value_richtext: {
                type: "string",
              },
              value_markdown: {
                type: "string",
              },
              required: {
                type: "boolean",
              },
            },
          },
          list: {
            required: ["id"],
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
          },
          folder: {
            required: ["id"],
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
          },
          space: {
            required: ["id"],
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
          },
          url: {
            type: "string",
          },
        },
      },
    },
    last_page: {
      type: "boolean",
    },
  },
} as Type;

export default {
  name: "List View Tasks",
  description: "Retrieves list view tasks in ClickUp",
  category: "Views",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { view_id, custom_task_ids } = input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/view/${view_id}/task?${queryString}`
          : `/v2/view/${view_id}/task`;

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
