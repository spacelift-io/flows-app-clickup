import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Checklist Item
const inputSchema = {
  checklist_id: {
    name: "Checklist ID",
    description: "",
    type: "string",
    required: true,
  },
  checklist_item_id: {
    name: "Checklist Item ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Delete Checklist Item
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Delete Checklist Item",
  description: "Deletes delete checklist item in ClickUp",
  category: "Task Checklists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { checklist_id, checklist_item_id } = input.event.inputConfig;
        const endpoint = `/v2/checklist/${checklist_id}/checklist_item/${checklist_item_id}`;

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
