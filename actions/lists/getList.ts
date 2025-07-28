import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get List
const inputSchema = {
  list_id: {
    name: "List ID",
    description:
      "The List ID. To find the List ID, right-click the List in your Sidebar, select Copy link, and paste the link in your URL. The last string in the URL is your List ID.",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Get List
const outputSchema = {
  required: [
    "id",
    "name",
    "orderindex",
    "content",
    "status",
    "priority",
    "assignee",
    "due_date",
    "due_date_time",
    "start_date",
    "start_date_time",
    "folder",
    "space",
    "inbound_address",
    "archived",
    "override_statuses",
    "statuses",
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
    inbound_address: {
      type: "string",
    },
    archived: {
      type: "boolean",
    },
    override_statuses: {
      type: "boolean",
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
      },
    },
    permission_level: {
      type: "string",
    },
  },
} as Type;

export default {
  name: "Get List",
  description: "Retrieves get list in ClickUp",
  category: "Lists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { list_id } = input.event.inputConfig;
        const endpoint = `/v2/list/${list_id}`;

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
