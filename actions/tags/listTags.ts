import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Tags
const inputSchema = {
  space_id: {
    name: "Space ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for List Tags
const outputSchema = {
  required: ["tags"],
  type: "object",
  properties: {
    tags: {
      type: "array",
      items: {
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
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "List Tags",
  description: "Retrieves list tags in ClickUp",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { space_id } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/tag`;

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
