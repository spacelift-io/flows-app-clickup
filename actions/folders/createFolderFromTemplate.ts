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

// Input schema for Create Folder From Template
const inputSchema = {
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
  space_id: {
    name: "Space ID",
    description: "ID of the Space where the Folder will be created",
    type: "string",
    required: true,
  },
  template_id: {
    name: "Template ID",
    description: "ID of the Folder template to use.",
    type: "string",
    required: true,
  },
  options: {
    name: "Options",
    description: "Options for creating the Folder",
    type: {
      type: "object",
      description: "Options for creating the Folder",
      properties: {
        return_immediately: {
          type: "boolean",
          description:
            "Flag if newly created Object ID should be returned without waiting for the asset itself and all its nested assets to be applied. If set to true, access checks are performed before returning, but the object might not be fully created yet. In case of a timeout on syncronous requests, the of objects from the template will continue to be created past the timeout.\n",
          default: true,
        },
        content: {
          type: "string",
          description: "List description",
        },
        time_estimate: {
          type: "boolean",
          description: "Include time (hours, minutes and seconds)",
        },
        automation: {
          type: "boolean",
          description: "Import automation options",
        },
        include_views: {
          type: "boolean",
          description: "Import views",
        },
        old_due_date: {
          type: "boolean",
          description: "Import tasks due dates",
        },
        old_start_date: {
          type: "boolean",
          description: "Import tasks start dates",
        },
        old_followers: {
          type: "boolean",
          description: "Import tasks watchers",
        },
        comment_attachments: {
          type: "boolean",
          description: "Import tasks comment attachments",
        },
        recur_settings: {
          type: "boolean",
          description: "Import tasks recurring settings",
        },
        old_tags: {
          type: "boolean",
          description: "Import tasks tags",
        },
        old_statuses: {
          type: "boolean",
          description: "Import tasks status settings",
        },
        subtasks: {
          type: "boolean",
          description: "Import tasks subtasks",
        },
        custom_type: {
          type: "boolean",
          description: "Import tasks types",
        },
        old_assignees: {
          type: "boolean",
          description: "Import tasks assignees",
        },
        attachments: {
          type: "boolean",
          description: "Import tasks attachments",
        },
        comment: {
          type: "boolean",
          description: "Import tasks comments",
        },
        old_status: {
          type: "boolean",
          description: "Import tasks current statuses",
        },
        external_dependencies: {
          type: "boolean",
          description: "Import tasks external dependencies",
        },
        internal_dependencies: {
          type: "boolean",
          description: "Import tasks internal dependencies",
        },
        priority: {
          type: "boolean",
          description: "Import tasks priority",
        },
        custom_fields: {
          type: "boolean",
          description: "Import tasks Custom Fields",
        },
        old_checklists: {
          type: "boolean",
          description: "Import tasks checklists",
        },
        relationships: {
          type: "boolean",
          description: "Import tasks relationships",
        },
        old_subtask_assignees: {
          type: "boolean",
          description: "Import tasks subtasks and assignees combination",
        },
        start_date: {
          type: "string",
          format: "date-time",
          description: "Project start date for remapping dates",
        },
        due_date: {
          type: "string",
          format: "date-time",
          description: "Project due date for remapping dates",
        },
        remap_start_date: {
          type: "boolean",
          description: "Remap start dates",
        },
        skip_weekends: {
          type: "boolean",
          description: "Skip weekends when remapping dates",
        },
        archived: {
          type: "integer",
          enum: [1, 2, null],
          description: "Include archived tasks (1 or 2 or null)",
        },
      },
    },
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Folder From Template
const outputSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "ID of the created Folder",
    },
    folder: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Unique identifier of the Folder",
        },
        name: {
          type: "string",
          description: "Name of the Folder",
        },
        orderindex: {
          type: "integer",
          description: "Order index of the Folder",
        },
        override_statuses: {
          type: "boolean",
          description: "Whether the Folder overrides default statuses",
        },
        hidden: {
          type: "boolean",
          description: "Whether the Folder is hidden",
        },
        space: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the Space containing the Folder",
            },
            name: {
              type: "string",
              description: "Name of the Space",
            },
            access: {
              type: "boolean",
              description: "Whether the user has access to the Space",
            },
          },
        },
        task_count: {
          type: "string",
          description: "Number of tasks in the Folder",
        },
        archived: {
          type: "boolean",
          description: "Whether the Folder is archived",
        },
        statuses: {
          type: "array",
          description: "List of statuses available in the Folder",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique identifier of the status",
              },
              status: {
                type: "string",
                description: "Name of the status",
              },
              orderindex: {
                type: "integer",
                description: "Order index of the status",
              },
              color: {
                type: "string",
                description: "Color code for the status",
              },
              type: {
                type: "string",
                description: "Type of the status (closed, custom, open)",
              },
            },
          },
        },
        lists: {
          type: "array",
          description: "Lists contained in the Folder",
          items: {
            type: "object",
          },
        },
        permission_level: {
          type: "string",
          description: "Permission level for the current user",
        },
      },
    },
  },
} as Type;

export default {
  name: "Create Folder From Template",
  description: "Creates create folder from template in ClickUp",
  category: "Folders",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { space_id, template_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/folder_template/${template_id}`;

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
