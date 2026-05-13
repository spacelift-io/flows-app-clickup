import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Create Task
const inputSchema = {
  list_id: {
    name: "List ID",
    description: "",
    type: "number",
    required: true,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
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
        type: "integer",
      },
    },
    required: false,
  },
  check_required_custom_fields: {
    name: "Check Required Custom Fields",
    description:
      "When creating a task via API any required Custom Fields are ignored by default (`false`).\\ \\ You can enforce required Custom Fields by including `check_required_custom_fields: true`.",
    type: "boolean",
    required: false,
  },
  custom_fields: {
    name: "Custom Fields",
    description: "",
    type: {
      type: "array",
      items: {
        required: ["id", "value"],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          value: {
            oneOf: [
              {
                type: "integer",
              },
              {
                type: "string",
              },
            ],
          },
        },
        additionalProperties: true,
      },
    },
    required: false,
  },
  custom_item_id: {
    name: "Custom Item ID",
    description:
      'The custom task type ID for this task. A value of `null` (default) creates a standard task type "Task".\\ \\ To get a list of available custom task type IDs for your Workspace, use the [Get Custom Task Types endpoint](ref:getcustomitems).',
    type: "number",
    required: false,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by its custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
  description: {
    name: "Description",
    description: "A detailed description",
    type: "string",
    required: false,
  },
  due_date: {
    name: "Due Date",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
  due_date_time: {
    name: "Due Date Time",
    description: "",
    type: "boolean",
    required: false,
  },
  group_assignees: {
    name: "Group Assignees",
    description: "Assign multiple user groups to the task.",
    type: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Assign multiple user groups to the task.",
    },
    required: false,
  },
  links_to: {
    name: "Links To",
    description:
      "Include a task ID to create a linked dependency with your new task.",
    type: {
      description:
        "Include a task ID to create a linked dependency with your new task.",
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    required: false,
  },
  markdown_content: {
    name: "Markdown Content",
    description:
      "Markdown formatted description for the task. If both `markdown_content` and `description` are provided, `markdown_content` will be used instead of `description`.",
    type: "string",
    required: false,
  },
  notify_all: {
    name: "Notify All",
    description:
      "If `notify_all` is true, notifications will be sent to everyone including the creator of the comment.",
    type: "boolean",
    required: false,
  },
  parent: {
    name: "Parent",
    description: "Parent task ID for creating subtasks",
    type: {
      description:
        "You can create a subtask by including an existing task ID.\\\n \\\nThe `parent` task ID you include can be a subtask, but must be in the same List specified in the path parameter.",
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    required: false,
  },
  points: {
    name: "Points",
    description: "Sprint points value for the task",
    type: "number",
    required: false,
  },
  priority: {
    name: "Priority",
    description: "The priority level",
    type: {
      anyOf: [
        {
          type: "integer",
        },
        {
          type: "null",
        },
      ],
    },
    required: false,
  },
  start_date: {
    name: "Start Date",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
  start_date_time: {
    name: "Start Date Time",
    description: "",
    type: "boolean",
    required: false,
  },
  status: {
    name: "Status",
    description: "The status of the item",
    type: "string",
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
    },
    required: false,
  },
  time_estimate: {
    name: "Time Estimate",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Create Task
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
        'The custom task type ID for this task. A value of `null` (default) creates a standard task type "Task".\\\n \\\nTo get a list of available custom task type IDs for your Workspace, use the [Get Custom Task Types endpoint](ref:getcustomitems).',
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
    archived: {
      type: "boolean",
    },
    group_assignees: {
      type: "array",
      items: {
        type: "string",
      },
    },
    email_assignees: {
      type: "string",
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
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Create Task",
  description: "Creates create task in ClickUp",
  category: "Tasks",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { list_id, custom_task_ids, ...inputData } =
          input.event.inputConfig;
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
            {
              method: "POST",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
