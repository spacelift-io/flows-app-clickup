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

// Input schema for Create Space
const inputSchema = {
  features: {
    name: "Features",
    description: "Configuration object for space features and settings",
    type: {
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
          additionalProperties: true,
        },
        time_tracking: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        tags: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        time_estimates: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        checklists: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        custom_fields: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        remap_dependencies: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        dependency_warning: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        portfolios: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
    required: true,
  },
  multiple_assignees: {
    name: "Multiple Assignees",
    description: "",
    type: "boolean",
    required: true,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Create Space
const outputSchema = {
  required: [
    "id",
    "name",
    "private",
    "statuses",
    "multiple_assignees",
    "features",
    "archived",
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
        required: ["id", "status", "type", "orderindex", "color"],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          status: {
            type: "string",
          },
          type: {
            type: "string",
          },
          orderindex: {
            type: "integer",
          },
          color: {
            type: "string",
          },
        },
        additionalProperties: true,
      },
    },
    multiple_assignees: {
      type: "boolean",
    },
    features: {
      required: [
        "due_dates",
        "sprints",
        "points",
        "custom_items",
        "tags",
        "time_estimates",
        "checklists",
        "zoom",
        "milestones",
        "custom_fields",
        "remap_dependencies",
        "dependency_warning",
        "multiple_assignees",
        "portfolios",
        "emails",
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
          additionalProperties: true,
        },
        sprints: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        points: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        custom_items: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        tags: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        time_estimates: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        checklists: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        zoom: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        milestones: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        custom_fields: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        remap_dependencies: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        dependency_warning: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        multiple_assignees: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        portfolios: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
        emails: {
          required: ["enabled"],
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
    archived: {
      type: "boolean",
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Create Space",
  description: "Creates create space in ClickUp",
  category: "Spaces",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/space`;

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
