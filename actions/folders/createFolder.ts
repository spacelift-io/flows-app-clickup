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

// Input schema for Create Folder
const inputSchema = {
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
  space_id: {
    name: "Space ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Create Folder
const outputSchema = {
  required: [
    "id",
    "name",
    "orderindex",
    "override_statuses",
    "hidden",
    "space",
    "task_count",
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
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Create Folder",
  description: "Creates create folder in ClickUp",
  category: "Folders",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { space_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/folder`;

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
