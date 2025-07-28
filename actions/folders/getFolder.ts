import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Folder
const inputSchema = {
  folder_id: {
    name: "Folder ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Get Folder
const outputSchema = {
  required: [
    "id",
    "name",
    "orderindex",
    "override_statuses",
    "hidden",
    "space",
    "task_count",
    "lists",
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
    override_statuses: {
      type: "boolean",
    },
    hidden: {
      type: "boolean",
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
    task_count: {
      type: "string",
    },
    lists: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as Type;

export default {
  name: "Get Folder",
  description: "Retrieves get folder in ClickUp",
  category: "Folders",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { folder_id } = input.event.inputConfig;
        const endpoint = `/v2/folder/${folder_id}`;

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
