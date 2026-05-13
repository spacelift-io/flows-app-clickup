import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Folders
const inputSchema = {
  space_id: {
    name: "Space ID",
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
} as Record<string, AppBlockInputConfigField>;

// Output schema for List Folders
const outputSchema = {
  contentMediaType: "application/json",
  required: ["folders"],
  type: "object",
  properties: {
    folders: {
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
          additionalProperties: true,
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
      additionalProperties: true,
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "List Folders",
  description: "Retrieves list folders in ClickUp",
  category: "Folders",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { space_id } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/folder`;

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
