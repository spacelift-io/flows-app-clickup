import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Task
const inputSchema = {
  task_id: {
    name: "Task ID",
    description: "",
    type: "string",
    required: true,
  },
  custom_fields: {
    name: "Custom Fields",
    description:
      'Include tasks with specific values in one or more Custom Fields. Custom Relationships are included.\\ \\ For example: `?custom_fields=[{"field_id":"abcdefghi12345678","operator":"=","value":"1234"},{"field_id":"jklmnop123456","operator":"<","value":"5"}]`\\ \\ Only set Custom Field values display in the `value` property of the `custom_fields` parameter. If you want to include tasks with specific values in only one Custom Field, use `custom_field` instead.\\ \\ Learn more about [filtering using Custom Fields.](doc:filtertasks)',
    type: ["string"],
    required: false,
  },
  include_markdown_description: {
    name: "Include Markdown Description",
    description:
      "To return task descriptions in Markdown format, use `?include_markdown_description=true`.",
    type: "boolean",
    required: false,
  },
  include_subtasks: {
    name: "Include Subtasks",
    description: "Include subtasks, default false",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Get Task
const outputSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    custom_id: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    custom_item_id: {
      description:
        'The custom task type ID for this task. A value of `null` represents task type "Task".\\\n \\\nTo get a list of available custom task type IDs for your Workspace, use the [Get Custom Task Types endpoint](ref:getcustomitems).',
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
    text_content: {
      type: "string",
    },
    description: {
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
    time_spent: {
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
      type: "array",
      items: {
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
    markdown_description: {
      type: "string",
    },
    attachments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          date: {
            type: "bigint",
          },
          type: {
            type: "int",
          },
          source: {
            type: "int",
          },
          version: {
            type: "int",
          },
          extension: {
            type: "string",
          },
          thumbnail_small: {
            type: "string",
          },
          thumbnail_medium: {
            type: "string",
          },
          thumbnail_large: {
            type: "string",
          },
          is_folder: {
            type: "boolean",
          },
          mimetype: {
            type: "string",
          },
          hidden: {
            type: "boolean",
          },
          parent_id: {
            type: "string",
          },
          size: {
            type: "bigint",
          },
          total_comments: {
            type: "int",
          },
          resolved_comments: {
            type: "int",
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
          deleted: {
            type: "boolean",
          },
          orientation: {
            type: "string",
          },
          url: {
            type: "string",
          },
          email_data: {
            type: "object",
          },
          url_w_query: {
            type: "string",
          },
          url_w_host: {
            type: "string",
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "Get Task",
  description: "Retrieves get task in ClickUp",
  category: "Tasks",

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
          ? `/v2/task/${task_id}?${queryString}`
          : `/v2/task/${task_id}`;

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
