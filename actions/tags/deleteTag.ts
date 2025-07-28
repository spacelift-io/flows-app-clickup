import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Tag
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
  tag_name: {
    name: "Tag Name",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Delete Tag
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Delete Tag",
  description: "Deletes delete tag in ClickUp",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { space_id, tag_name } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/tag/${tag_name}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            { method: "DELETE" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
