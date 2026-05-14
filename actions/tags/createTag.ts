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
      additionalProperties: true,
    },
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Create Tag
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
  additionalProperties: true,
} as Type;

export default {
  name: "Create Tag",
  description: "Creates create tag in ClickUp",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema,
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
