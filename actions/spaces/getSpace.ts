import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Space
const inputSchema = {
  space_id: {
    name: "Space ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Get Space
const outputSchema = {
  required: [
    "id",
    "name",
    "private",
    "statuses",
    "multiple_assignees",
    "features",
  ],
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    private: {
      type: "boolean",
    },
    statuses: {
      type: "array",
      items: {
        required: ["status", "color", "orderindex", "type"],
        type: "object",
        properties: {
          status: {
            type: "string",
          },
          color: {
            type: "string",
          },
          orderindex: {
            type: "integer",
          },
          type: {
            type: "string",
          },
        },
      },
    },
    multiple_assignees: {
      type: "boolean",
    },
    features: {
      required: [
        "due_dates",
        "time_tracking",
        "tags",
        "time_estimates",
        "checklists",
        "custom_fields",
        "remap_dependencies",
        "dependency_warning",
        "portfolios",
      ],
      type: "object",
      properties: {
        due_dates: {
          required: [
            "enabled",
            "start_date",
            "remap_due_dates",
            "remap_closed_due_date",
          ],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
            start_date: {
              type: "boolean",
            },
            remap_due_dates: {
              type: "boolean",
            },
            remap_closed_due_date: {
              type: "boolean",
            },
          },
        },
        time_tracking: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        tags: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        time_estimates: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        checklists: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        custom_fields: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        remap_dependencies: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        dependency_warning: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
        portfolios: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "Get Space",
  description: "Retrieves get space in ClickUp",
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
            { method: "GET" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
