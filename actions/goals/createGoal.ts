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

// Input schema for Create Goal
const inputSchema = {
  color: {
    name: "Color",
    description: "The color value or code",
    type: "string",
    required: true,
  },
  description: {
    name: "Description",
    description: "A detailed description",
    type: "string",
    required: true,
  },
  due_date: {
    name: "Due Date",
    description: "",
    type: "number",
    required: true,
  },
  multiple_owners: {
    name: "Multiple Owners",
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
  owners: {
    name: "Owners",
    description: "Array of user IDs who own this item",
    type: ["number"],
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Goal
const outputSchema = {
  required: ["goal"],
  type: "object",
  properties: {
    goal: {
      required: [
        "id",
        "name",
        "team_id",
        "date_created",
        "start_date",
        "due_date",
        "description",
        "private",
        "archived",
        "creator",
        "color",
        "pretty_id",
        "multiple_owners",
        "folder_id",
        "members",
        "owners",
        "key_results",
        "percent_completed",
        "history",
        "pretty_url",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        team_id: {
          type: "string",
        },
        date_created: {
          type: "string",
        },
        start_date: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        due_date: {
          type: "string",
        },
        description: {
          type: "string",
        },
        private: {
          type: "boolean",
        },
        archived: {
          type: "boolean",
        },
        creator: {
          type: "integer",
        },
        color: {
          type: "string",
        },
        pretty_id: {
          type: "string",
        },
        multiple_owners: {
          type: "boolean",
        },
        folder_id: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        members: {
          type: "array",
          items: {
            type: "string",
          },
        },
        owners: {
          type: "array",
          items: {
            required: [
              "id",
              "username",
              "initials",
              "email",
              "color",
              "profilePicture",
            ],
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              username: {
                type: "string",
              },
              initials: {
                type: "string",
              },
              email: {
                type: "string",
              },
              color: {
                type: "string",
              },
              profilePicture: {
                type: "string",
              },
            },
          },
        },
        key_results: {
          type: "array",
          items: {
            type: "string",
          },
        },
        percent_completed: {
          type: "integer",
        },
        history: {
          type: "array",
          items: {
            type: "string",
          },
        },
        pretty_url: {
          type: "string",
        },
      },
    },
  },
} as Type;

export default {
  name: "Create Goal",
  description: "Creates create goal in ClickUp",
  category: "Goals",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/goal`;

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
