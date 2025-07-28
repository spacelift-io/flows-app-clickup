import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Update Task
const inputSchema = {
  task_id: {
    name: "Task ID",
    description: "",
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
    type: ["number"],
    required: false,
  },
  custom_item_id: {
    name: "Custom Item ID",
    description:
      'The custom task type ID for this task. A value of `null` (default) sets the task type to type "Task".\\ \\ To get a list of available custom task type IDs for your Workspace, use the [Get Custom Task Types endpoint](ref:getcustomitems).',
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
    type: "number",
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
    description: "",
    type: ["number"],
    required: false,
  },
  markdown_content: {
    name: "Markdown Content",
    description:
      "Markdown formatted description for the task. If both `markdown_content` and `description` are provided, `markdown_content` will be used instead of `description`.",
    type: "string",
    required: false,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: false,
  },
  parent: {
    name: "Parent",
    description: "Parent task ID for creating subtasks",
    type: "string",
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
    type: "number",
    required: false,
  },
  start_date: {
    name: "Start Date",
    description: "",
    type: "number",
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
  time_estimate: {
    name: "Time Estimate",
    description: "",
    type: "number",
    required: false,
  },
  watchers: {
    name: "Watchers",
    description: "Array of user IDs to watch this item",
    type: ["number"],
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Task
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
    archived: {
      type: "boolean",
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
    group_assignees: {
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
      type: "string",
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
        required: [
          "id",
          "name",
          "type",
          "type_config",
          "date_created",
          "hide_from_guests",
          "required",
        ],
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
  },
} as Type;

export default {
  name: "Update Task",
  description: "Updates update task in ClickUp",
  category: "Tasks",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { task_id, custom_task_ids, ...inputData } =
          input.event.inputConfig;
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
            {
              method: "PUT",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
