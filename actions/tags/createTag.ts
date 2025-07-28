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

// Input schema for Create Tag
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
      required: ["name", "tag_fg", "tag_bg"],
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        tag_fg: {
          type: "string",
        },
        tag_bg: {
          type: "string",
        },
      },
    },
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Tag
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Create Tag",
  description: "Creates create tag in ClickUp",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { space_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/tag`;

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
