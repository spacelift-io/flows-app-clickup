import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Update Checklist
const inputSchema = {
  checklist_id: {
    name: "Checklist ID",
    description: "",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: false,
  },
  position: {
    name: "Position",
    description:
      'Position refers to the order of appearance of checklists on a task.\\ \\ To set a checklist to appear at the top of the checklists section of a task, use `"position": 0`.',
    type: "number",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Checklist
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Update Checklist",
  description: "Updates update checklist in ClickUp",
  category: "Task Checklists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { checklist_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/checklist/${checklist_id}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            {
              method: "PUT",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
