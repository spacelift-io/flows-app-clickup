import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Key Result
const inputSchema = {
  key_result_id: {
    name: "Key Result ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Delete Key Result
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
  additionalProperties: true,
} as Type;

export default {
  name: "Delete Key Result",
  description: "Deletes delete key result in ClickUp",
  category: "Goals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { key_result_id } = input.event.inputConfig;
        const endpoint = `/v2/key_result/${key_result_id}`;

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
