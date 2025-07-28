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

// Input schema for Create Space List From Template
const inputSchema = {
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
  space_id: {
    name: "Space ID",
    description: "ID of the Space where the List will be created",
    type: "string",
    required: true,
  },
  template_id: {
    name: "Template ID",
    description: "ID of the template to use",
    type: "string",
    required: true,
  },
  options: {
    name: "Options",
    description: "Options for creating the List",
    type: {
      type: "object",
      description: "Options for creating the List",
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
          type: "number",
          description: "Include time (hours, minutes and seconds)",
        },
        automation: {
          type: "boolean",
          description: "Import automation settings",
        },
        include_views: {
          type: "boolean",
          description: "Import views",
        },
        old_due_date: {
          type: "boolean",
          description: "Import tasks' due dates",
        },
        old_start_date: {
          type: "boolean",
          description: "Import tasks' start dates",
        },
        old_followers: {
          type: "boolean",
          description: "Import tasks' watchers",
        },
        comment_attachments: {
          type: "boolean",
          description: "Import tasks' comment attachments",
        },
        recur_settings: {
          type: "boolean",
          description: "Import tasks' recurring settings",
        },
        old_tags: {
          type: "boolean",
          description: "Import tasks' tags",
        },
        old_statuses: {
          type: "boolean",
          description: "Import tasks' status settings",
        },
        subtasks: {
          type: "boolean",
          description: "Import tasks' subtasks",
        },
        custom_type: {
          type: "boolean",
          description: "Import tasks' task types",
        },
        old_assignees: {
          type: "boolean",
          description: "Import tasks' assignees",
        },
        attachments: {
          type: "boolean",
          description: "Import tasks' attachments",
        },
        comment: {
          type: "boolean",
          description: "Import tasks' comments",
        },
        old_status: {
          type: "boolean",
          description: "Import tasks' current statuses",
        },
        external_dependencies: {
          type: "boolean",
          description: "Import tasks' external dependencies",
        },
        internal_dependencies: {
          type: "boolean",
          description: "Import tasks' internal dependencies",
        },
        priority: {
          type: "boolean",
          description: "Import tasks' priorities",
        },
        custom_fields: {
          type: "boolean",
          description: "Import tasks' Custom Fields",
        },
        old_checklists: {
          type: "boolean",
          description: "Import tasks' checklists",
        },
        relationships: {
          type: "boolean",
          description: "Import tasks' relationships",
        },
        old_subtask_assignees: {
          type: "boolean",
          description: "Import tasks' subtask assignees",
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
          description: "Include archived tasks",
        },
      },
    },
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Space List From Template
const outputSchema = {
  type: "object",
  description:
    "Response object returned when a new List is created from a template in a Folder or Space.",
  properties: {
    id: {
      type: "string",
      description: "Unique identifier of the newly created List",
    },
    list: {
      type: "object",
      description: "Detailed information about the created List",
      properties: {
        id: {
          type: "string",
          description: "Unique identifier of the List (matches parent id)",
        },
        name: {
          type: "string",
          description: "Display name of the List",
        },
        deleted: {
          type: "boolean",
          description: "Indicates if the List has been marked as deleted",
        },
        orderindex: {
          type: "integer",
          description:
            "Position of the List relative to other Lists in the same container",
        },
        priority: {
          type: "string",
          description: "Priority level of the List, if applicable",
          nullable: true,
        },
        assignee: {
          type: "string",
          description: "Default assignee for the List, if applicable",
          nullable: true,
        },
        due_date: {
          type: "string",
          format: "date-time",
          description: "Default due date for tasks in the List",
          nullable: true,
        },
        start_date: {
          type: "string",
          format: "date-time",
          description: "Default start date for tasks in the List",
          nullable: true,
        },
        folder: {
          type: "object",
          description:
            "Information about the parent Folder containing this List, if applicable",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier of the parent Folder",
            },
            name: {
              type: "string",
              description: "Display name of the parent Folder",
            },
            hidden: {
              type: "boolean",
              description:
                "Indicates if the Folder is hidden from standard views",
            },
            access: {
              type: "boolean",
              description:
                "Indicates if the current user has access to this Folder",
            },
          },
        },
        space: {
          type: "object",
          description:
            "Information about the Workspace Space containing this List",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier of the Space",
            },
            name: {
              type: "string",
              description: "Display name of the Space",
            },
            access: {
              type: "boolean",
              description:
                "Indicates if the current user has access to this Space",
            },
          },
        },
        inbound_address: {
          type: "string",
          description:
            "Email address that can be used to create tasks in this List via email",
        },
        archived: {
          type: "boolean",
          description: "Indicates if the List is archived",
        },
        override_statuses: {
          type: "boolean",
          description:
            "Indicates if this List uses custom statuses instead of Space default statuses",
        },
        statuses: {
          type: "array",
          description: "List of available statuses for tasks in this List",
          items: {
            type: "object",
            description: "Status configuration object",
            properties: {
              id: {
                type: "string",
                description: "Unique identifier for the status",
              },
              status: {
                type: "string",
                description: "Display name of the status",
              },
              orderindex: {
                type: "integer",
                description: "Position of this status in the status list",
              },
              color: {
                type: "string",
                description: "Color code associated with this status",
              },
              type: {
                type: "string",
                description:
                  "Category of the status (e.g., open, closed, in progress)",
              },
              status_group: {
                type: "string",
                description: "TODO - Identifier for grouping related statuses",
              },
            },
          },
        },
        permission_level: {
          type: "string",
          description:
            "Access level the current user has for this List (e.g., create, edit, view)",
        },
      },
    },
  },
} as Type;

export default {
  name: "Create Space List From Template",
  description: "Creates create space list from template in ClickUp",
  category: "Lists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { space_id, template_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/space/${space_id}/list_template/${template_id}`;

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
