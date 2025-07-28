import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Space
const inputSchema = {
  space_id: {
    name: "Space ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Delete Space
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Delete Space",
  description: "Deletes delete space in ClickUp",
  category: "Spaces",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { space_id } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}`;

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
