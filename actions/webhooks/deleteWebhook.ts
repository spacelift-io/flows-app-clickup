import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Webhook
const inputSchema = {
  webhook_id: {
    name: "Webhook ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Delete Webhook
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
  additionalProperties: true,
} as Type;

export default {
  name: "Delete Webhook",
  description: "Deletes delete webhook in ClickUp",
  category: "Webhooks",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { webhook_id } = input.event.inputConfig;
        const endpoint = `/v2/webhook/${webhook_id}`;

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
