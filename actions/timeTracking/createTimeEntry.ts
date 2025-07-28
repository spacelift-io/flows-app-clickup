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

// Input schema for Create Time Entry
const inputSchema = {
  duration: {
    name: "Duration",
    description:
      "When there are values for both start and end, duration is ignored",
    type: "number",
    required: true,
  },
  start: {
    name: "Start",
    description: "The start time in Unix timestamp format",
    type: "number",
    required: true,
  },
  assignee: {
    name: "Assignee",
    description: "The user ID to assign",
    type: "number",
    required: false,
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
  end: {
    name: "End",
    description: "The end time in Unix timestamp format",
    type: "number",
    required: false,
  },
  stop: {
    name: "Stop",
    description: "The stop time parameter, can be used instead of duration",
    type: "number",
    required: false,
  },
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
      },
    },
    required: false,
  },
  tid: {
    name: "Tid",
    description: "The team identifier",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Time Entry
const outputSchema = {
  required: [
    "description",
    "tags",
    "start",
    "billable",
    "duration",
    "assignee",
    "tid",
  ],
  type: "object",
  properties: {
    description: {
      type: "string",
    },
    tags: {
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
      },
    },
    start: {
      type: "integer",
    },
    billable: {
      type: "boolean",
    },
    duration: {
      type: "integer",
    },
    assignee: {
      type: "integer",
    },
    tid: {
      type: "string",
    },
  },
} as Type;

export default {
  name: "Create Time Entry",
  description: "Creates create time entry in ClickUp",
  category: "Time Tracking",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { team_Id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/team/${team_Id}/time_entries`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            {
              method: "POST",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
