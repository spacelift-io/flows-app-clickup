import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Goal
const inputSchema = {
  goal_id: {
    name: "Goal ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Delete Goal
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
  additionalProperties: true,
} as Type;

export default {
  name: "Delete Goal",
  description: "Deletes delete goal in ClickUp",
  category: "Goals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { goal_id } = input.event.inputConfig;
        const endpoint = `/v2/goal/${goal_id}`;

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
