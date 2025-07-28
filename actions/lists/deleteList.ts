import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete List
const inputSchema = {
  list_id: {
    name: "List ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Delete List
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Delete List",
  description: "Deletes delete list in ClickUp",
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
            { method: "DELETE" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
