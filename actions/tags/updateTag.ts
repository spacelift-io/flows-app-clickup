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

// Input schema for Update Tag
const inputSchema = {
  space_id: {
    name: "Space ID",
    description: "",
    type: "number",
    required: true,
  },
  tag: {
    name: "Tag",
    description: "The tag information",
    type: {
      required: ["name", "fg_color", "bg_color"],
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        fg_color: {
          type: "string",
        },
        bg_color: {
          type: "string",
        },
      },
    },
    required: true,
  },
  tag_name: {
    name: "Tag Name",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Tag
const outputSchema = {
  required: ["tag"],
  type: "object",
  properties: {
    tag: {
      required: ["name", "fg_color", "bg_color"],
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        fg_color: {
          type: "string",
        },
        bg_color: {
          type: "string",
        },
      },
    },
  },
} as Type;

export default {
  name: "Update Tag",
  description: "Updates update tag in ClickUp",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { space_id, tag_name, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/tag/${tag_name}`;

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
