import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
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
} as Record<string, AppBlockInputConfigField>;

// Output schema for Delete List
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
  additionalProperties: true,
} as Type;

export default {
  name: "Delete List",
  description: "Deletes delete list in ClickUp",
  category: "Lists",

  inputs: {
    default: {
      config: inputSchema,
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
