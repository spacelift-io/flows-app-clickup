import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Tasks
const inputSchema = {
  list_id: {
    name: "List ID",
    description:
      "To find the list_id: \\ 1. In the Sidebar, hover over the List and click the **ellipsis ...** menu. \\ 2. Select **Copy link.** \\ 3. Use the copied URL to find the list_id. The list_id is the number that follows /li in the URL.",
    type: "number",
    required: true,
  },
  archived: {
    name: "Archived",
    description: "Whether to include archived items",
    type: "boolean",
    required: false,
  },
  assignees: {
    name: "Assignees",
    description: "Array of user IDs to assign",
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Filter by Assignees. For example: \\\n \\\n`?assignees[]=1234&assignees[]=5678`",
    },
    required: false,
  },
  custom_field: {
    name: "Custom Field",
    description:
      "Include tasks with specific values in only one Custom Field. This Custom Field can be a Custom Relationship.",
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Include tasks with specific values in only one Custom Field. This Custom Field can be a Custom Relationship.",
    },
    required: false,
  },
  custom_fields: {
    name: "Custom Fields",
    description:
      'Include tasks with specific values in one or more Custom Fields. Custom Relationships are included.\\ \\ For example: `?custom_fields=[{"field_id":"abcdefghi12345678","operator":"=","value":"1234"},{"field_id":"jklmnop123456","operator":"<","value":"5"}]`\\ \\ Only set Custom Field values display in the `value` property of the `custom_fields` parameter. If you want to include tasks with specific values in only one Custom Field, use `custom_field` instead.\\ \\ Learn more about [filtering using Custom Fields.](doc:taskfilters)',
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        'Include tasks with specific values in one or more Custom Fields. Custom Relationships are included.\\\n \\\nFor example: `?custom_fields=[{"field_id":"abcdefghi12345678","operator":"=","value":"1234"},{"field_id":"jklmnop123456","operator":"<","value":"5"}]`\\\n \\\nOnly set Custom Field values display in the `value` property of the `custom_fields` parameter. If you want to include tasks with specific values in only one Custom Field, use `custom_field` instead.\\\n \\\nLearn more about [filtering using Custom Fields.](doc:taskfilters)',
    },
    required: false,
  },
  custom_items: {
    name: "Custom Items",
    description:
      "Filter by custom task types. For example: \\ \\ `?custom_items[]=0&custom_items[]=1300` \\ \\ Including `0` returns tasks. Including `1` returns Milestones. Including any other number returns the custom task type as defined in your Workspace.",
    type: {
      type: "array",
      items: {
        type: "number",
      },
      description:
        "Filter by custom task types. For example: \\\n \\\n`?custom_items[]=0&custom_items[]=1300` \\\n \\\nIncluding `0` returns tasks. Including `1` returns Milestones. Including any other number returns the custom task type as defined in your Workspace.",
    },
    required: false,
  },
  date_created_gt: {
    name: "Date Created Gt",
    description:
      "Filter by date created greater than Unix time in milliseconds.",
    type: {
      type: "integer",
      description:
        "Filter by date created greater than Unix time in milliseconds.",
    },
    required: false,
  },
  date_created_lt: {
    name: "Date Created Lt",
    description: "Filter by date created less than Unix time in milliseconds.",
    type: {
      type: "integer",
      description:
        "Filter by date created less than Unix time in milliseconds.",
    },
    required: false,
  },
  date_done_gt: {
    name: "Date Done Gt",
    description: "Filter by date done greater than Unix time in milliseconds.",
    type: {
      type: "integer",
      description:
        "Filter by date done greater than Unix time in milliseconds.",
    },
    required: false,
  },
  date_done_lt: {
    name: "Date Done Lt",
    description: "Filter by date done less than Unix time in milliseconds.",
    type: {
      type: "integer",
      description: "Filter by date done less than Unix time in milliseconds.",
    },
    required: false,
  },
  date_updated_gt: {
    name: "Date Updated Gt",
    description:
      "Filter by date updated greater than Unix time in milliseconds.",
    type: {
      type: "integer",
      description:
        "Filter by date updated greater than Unix time in milliseconds.",
    },
    required: false,
  },
  date_updated_lt: {
    name: "Date Updated Lt",
    description: "Filter by date updated less than Unix time in milliseconds.",
    type: {
      type: "integer",
      description:
        "Filter by date updated less than Unix time in milliseconds.",
    },
    required: false,
  },
  due_date_gt: {
    name: "Due Date Gt",
    description: "Filter by due date greater than Unix time in milliseconds.",
    type: {
      type: "integer",
      description: "Filter by due date greater than Unix time in milliseconds.",
    },
    required: false,
  },
  due_date_lt: {
    name: "Due Date Lt",
    description: "Filter by due date less than Unix time in milliseconds.",
    type: {
      type: "integer",
      description: "Filter by due date less than Unix time in milliseconds.",
    },
    required: false,
  },
  include_closed: {
    name: "Include Closed",
    description:
      "Include or excluse closed tasks. By default, they are excluded.\\ \\ To include closed tasks, use `include_closed: true`.",
    type: "boolean",
    required: false,
  },
  include_markdown_description: {
    name: "Include Markdown Description",
    description:
      "To return task descriptions in Markdown format, use `?include_markdown_description=true`.",
    type: "boolean",
    required: false,
  },
  order_by: {
    name: "Order By",
    description:
      "Order by a particular field. By default, tasks are ordered by `created`.\\ \\ Options include: `id`, `created`, `updated`, and `due_date`.",
    type: "string",
    required: false,
  },
  page: {
    name: "Page",
    description: "Page number for pagination",
    type: {
      type: "integer",
      description: "Page to fetch (starts at 0).",
    },
    required: false,
  },
  reverse: {
    name: "Reverse",
    description: "Whether to reverse the order",
    type: "boolean",
    required: false,
  },
  statuses: {
    name: "Statuses",
    description:
      "Filter by statuses. To include closed tasks, use the `include_closed` parameter. \\ \\ For example: \\ \\ `?statuses[]=to%20do&statuses[]=in%20progress`",
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Filter by statuses. To include closed tasks, use the `include_closed` parameter. \\\n \\\nFor example: \\\n \\\n`?statuses[]=to%20do&statuses[]=in%20progress`",
    },
    required: false,
  },
  subtasks: {
    name: "Subtasks",
    description: "Whether to include subtasks",
    type: "boolean",
    required: false,
  },
  tags: {
    name: "Tags",
    description: "Array of tag names to apply",
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Filter by tags. For example: \\\n \\\n`?tags[]=tag1&tags[]=this%20tag`",
    },
    required: false,
  },
  watchers: {
    name: "Watchers",
    description: "Array of user IDs to watch this item",
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Filter by watchers.",
    },
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

// Output schema for List Tasks
const outputSchema = {
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
            additionalProperties: true,
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
        },
        additionalProperties: true,
      },
    },
    last_page: {
      type: "boolean",
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "List Tasks",
  description: "Retrieves list tasks in ClickUp",
  category: "Tasks",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { list_id, custom_task_ids } = input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/list/${list_id}/task?${queryString}`
          : `/v2/list/${list_id}/task`;

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
