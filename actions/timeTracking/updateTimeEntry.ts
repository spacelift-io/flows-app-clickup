import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Update Time Entry
const inputSchema = {
  tags: {
    name: "Tags",
    description: "Array of tag names to apply",
    type: {
      description:
        "Users on the Business Plan and above can include a time tracking label.",
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
    required: true,
  },
  tid: {
    name: "Tid",
    description: "The team identifier",
    type: "string",
    required: true,
  },
  timer_id: {
    name: "Timer ID",
    description: "",
    type: "number",
    required: true,
  },
  billable: {
    name: "Billable",
    description: "Whether the time entry is billable",
    type: "boolean",
    required: false,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by it's custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
  description: {
    name: "Description",
    description: "A detailed description",
    type: "string",
    required: false,
  },
  duration: {
    name: "Duration",
    description:
      "When there are values for both start and end, duration is ignored",
    type: {
      type: "integer",
    },
    required: false,
  },
  end: {
    name: "End",
    description: "The end time in Unix timestamp format",
    type: {
      type: "integer",
      description: "When providing `end`, you must also provide `start`.",
    },
    required: false,
  },
  start: {
    name: "Start",
    description: "The start time in Unix timestamp format",
    type: {
      type: "integer",
      description: "When providing `start`, you must also provide `end`.",
    },
    required: false,
  },
  tag_action: {
    name: "Tag Action",
    description: "",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Update Time Entry
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
  additionalProperties: true,
} as Type;

export default {
  name: "Update Time Entry",
  description: "Updates update time entry in ClickUp",
  category: "Time Tracking",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { timer_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/time_entries/${timer_id}`;

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
