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

// Input schema for Update List
const inputSchema = {
  list_id: {
    name: "List ID",
    description: "",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
  assignee: {
    name: "Assignee",
    description: "The user ID to assign",
    type: "string",
    required: false,
  },
  content: {
    name: "Content",
    description: "The main content",
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
  markdown_content: {
    name: "Markdown Content",
    description:
      "Use `markdown_content` instead of `content` to format your List description.",
    type: "string",
    required: false,
  },
  priority: {
    name: "Priority",
    description: "The priority level",
    type: {
      type: "integer",
    },
    required: false,
  },
  status: {
    name: "Status",
    description: "The status of the item",
    type: "string",
    required: false,
  },
  unset_status: {
    name: "Unset Status",
    description:
      "By default, this is `false.` To remove the List color use `unset_status: true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Update List
const outputSchema = {
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
      required: ["status", "color", "hide_label"],
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
      additionalProperties: true,
    },
    priority: {
      required: ["priority", "color"],
      type: "object",
      properties: {
        priority: {
          type: "string",
        },
        color: {
          type: "string",
        },
      },
      additionalProperties: true,
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
      type: "string",
    },
    due_date_time: {
      type: "boolean",
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
    start_date_time: {
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
      additionalProperties: true,
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
      additionalProperties: true,
    },
    statuses: {
      type: "array",
      items: {
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
    },
    inbound_address: {
      type: "string",
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Update List",
  description: "Updates update list in ClickUp",
  category: "Lists",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { list_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/list/${list_id}`;

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
