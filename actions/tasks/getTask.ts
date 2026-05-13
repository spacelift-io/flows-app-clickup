import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
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
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        'Include tasks with specific values in one or more Custom Fields. Custom Relationships are included.\\\n \\\nFor example: `?custom_fields=[{"field_id":"abcdefghi12345678","operator":"=","value":"1234"},{"field_id":"jklmnop123456","operator":"<","value":"5"}]`\\\n \\\nOnly set Custom Field values display in the `value` property of the `custom_fields` parameter. If you want to include tasks with specific values in only one Custom Field, use `custom_field` instead.\\\n \\\nLearn more about [filtering using Custom Fields.](doc:filtertasks)',
    },
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
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by its custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

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
      additionalProperties: true,
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
      additionalProperties: true,
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
          additionalProperties: true,
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
      type: "number",
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
            additionalProperties: true,
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
                additionalProperties: true,
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
        additionalProperties: true,
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
      additionalProperties: true,
    },
    folder: {
      required: ["id"],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
      additionalProperties: true,
    },
    space: {
      required: ["id"],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
      additionalProperties: true,
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
            type: "number",
          },
          type: {
            type: "integer",
          },
          source: {
            type: "integer",
          },
          version: {
            type: "integer",
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
            type: "number",
          },
          total_comments: {
            type: "integer",
          },
          resolved_comments: {
            type: "integer",
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
            additionalProperties: true,
          },
          url_w_query: {
            type: "string",
          },
          url_w_host: {
            type: "string",
          },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Get Task",
  description: "Retrieves get task in ClickUp",
  category: "Tasks",

  inputs: {
    default: {
      config: inputSchema,
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
