import refParser from "@apidevtools/json-schema-ref-parser";
import schema from "../schema.json" with { type: "json" };
import { join } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { fieldDescriptions } from "./fieldDescriptionMap";
import { schemaDefinitions } from "./schemaDefinitions";
import { toCamelCase, fieldNameToDisplayName } from "./utils";

// Configuration constants for schema processing
const UNUSED_PROPS = ["example", "examples", "title", "contentEncoding"];
const IGNORED_PARAMS = ["team_id"]; // Parameters to exclude from generated schemas

// Map of non-standard types we've seen in the ClickUp OpenAPI spec to valid JSON Schema types.
const INVALID_TYPE_MAP: Record<string, string> = {
  int: "integer",
  bigint: "number",
  float: "number",
  double: "number",
  long: "integer",
};

const CUSTOM_TASK_IDS_FIELD = "custom_task_ids";

/**
 * Checks if a parameter should be ignored during schema generation.
 * Uses case-insensitive matching for flexibility.
 */
function isIgnoredParam(paramName: string): boolean {
  return IGNORED_PARAMS.some((ignored) =>
    paramName.toLowerCase().includes(ignored),
  );
}

/**
 * ClickUp Schema Generator
 *
 * Processes the ClickUp OpenAPI schema and generates TypeScript action files
 * with embedded JSON-Schema-compatible input and output schemas that pass the
 * Flows runtime input validation.
 */

const ACTIONS_DIR = "./actions";

await refParser.dereference(schema);

type SchemaTransformRule = (node: any) => any;

const SCHEMA_TRANSFORM_RULES: Record<string, SchemaTransformRule> = {
  removeUnusedProps: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    UNUSED_PROPS.forEach((prop) => delete result[prop]);
    return result;
  },

  cleanDescriptions: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    if (typeof result.description === "string") {
      const desc = result.description.trim();
      if (/^\[.*\]\(doc:.*\)$/.test(desc) || desc === "") {
        delete result.description;
      }
    }
    return result;
  },

  // Map non-standard types from ClickUp's OpenAPI spec to valid JSON Schema types.
  fixInvalidTypes: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    if (typeof result.type === "string" && INVALID_TYPE_MAP[result.type]) {
      result.type = INVALID_TYPE_MAP[result.type];
    }
    return result;
  },

  // Convert OpenAPI's array-form union types into anyOf form so the rest
  // of the pipeline sees JSON-Schema-compatible structures.
  convertUnionTypes: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    if (Array.isArray(result.type)) {
      result.anyOf = result.type.map((t: string) => ({
        type: INVALID_TYPE_MAP[t] || t,
      }));
      delete result.type;
    }
    return result;
  },

  // anyOf: [X] -> X (single-element anyOf is meaningless)
  simplifyTrivialAnyOf: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    if (Array.isArray(node.anyOf) && node.anyOf.length === 1) {
      const { anyOf, ...rest } = node;
      return { ...anyOf[0], ...rest };
    }
    return node;
  },

  // Ensure object schemas have additionalProperties: true so the frontend
  // type generator produces a permissive TypeScript type that matches the
  // runtime JSON Schema validation behavior.
  addAdditionalProperties: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    if (node.type === "object" && node.additionalProperties === undefined) {
      return { ...node, additionalProperties: true };
    }
    return node;
  },
};

function transformSchema(schema: any, rules: SchemaTransformRule[]): any {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => transformSchema(item, rules));
  }

  let result = { ...schema };

  for (const rule of rules) {
    result = rule(result);
  }

  for (const key in result) {
    if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = transformSchema(result[key], rules);
    }
  }

  return result;
}

const COMMON_RULES = [
  SCHEMA_TRANSFORM_RULES.removeUnusedProps,
  SCHEMA_TRANSFORM_RULES.cleanDescriptions,
  SCHEMA_TRANSFORM_RULES.fixInvalidTypes,
  SCHEMA_TRANSFORM_RULES.convertUnionTypes,
  SCHEMA_TRANSFORM_RULES.simplifyTrivialAnyOf,
];

function cleanSchema(obj: unknown): unknown {
  return transformSchema(obj, COMMON_RULES);
}

function cleanOutputSchema(obj: unknown): unknown {
  // Output schemas: same transformations as input.
  // We deliberately keep full JSON Schema form (no array shorthand) so the
  // runtime can validate them strictly.
  return transformSchema(obj, [
    ...COMMON_RULES,
    SCHEMA_TRANSFORM_RULES.addAdditionalProperties,
  ]);
}

function normalizeFieldType(node: any): any {
  // Recursively cast a node into a clean JSON Schema usable as an
  // AppBlockInputConfigField.type. Returns a SimpleType string when the
  // node is a trivial primitive, otherwise returns a JSON Schema object.
  if (!node || typeof node !== "object") return node;

  // Walk through nested structures: any nested types must also be valid.
  const cleaned = transformSchema(node, [
    ...COMMON_RULES,
    SCHEMA_TRANSFORM_RULES.addAdditionalProperties,
  ]);

  if (typeof cleaned !== "object" || cleaned === null) return cleaned;
  if (Array.isArray(cleaned)) return cleaned;

  // Trivial primitive: { type: "string", description: "..." } -> "string"
  // The outer config field already carries the description, so it's safe
  // to drop a redundant inner description on simple types.
  if (
    typeof cleaned.type === "string" &&
    !cleaned.properties &&
    !cleaned.items &&
    !cleaned.anyOf &&
    !cleaned.oneOf &&
    !cleaned.enum &&
    ["string", "number", "boolean"].includes(cleaned.type)
  ) {
    return cleaned.type;
  }

  return cleaned;
}

/**
 * Returns a meaningful description for a field, prioritizing manually curated
 * descriptions over potentially useless auto-generated ones from the OpenAPI
 * spec.
 */
function getFieldDescription(
  fieldName: string,
  existingDescription?: string,
): string {
  const curatedDescription = fieldDescriptions[fieldName];
  if (curatedDescription) {
    return curatedDescription;
  }

  if (existingDescription) {
    const desc = existingDescription.trim().replace(/\s+/g, " ");

    const isUselessPattern =
      /^[a-f0-9-]+ \(uuid\)$/i.test(desc) ||
      /^\d+ \((?:string|number|integer)\)$/.test(desc) ||
      desc.length < 10;

    if (!isUselessPattern) {
      return desc;
    }
  }

  return "";
}

function convertJsonSchemaToAppBlockConfig(
  jsonSchema: any,
): Record<string, any> {
  const config: Record<string, any> = {};
  if (!jsonSchema.properties) {
    return config;
  }

  const requiredSet = new Set(jsonSchema.required || []);
  const allFieldNames = Object.keys(jsonSchema.properties).sort((a, b) => {
    const aIsRequired = requiredSet.has(a);
    const bIsRequired = requiredSet.has(b);
    if (aIsRequired !== bIsRequired) {
      return aIsRequired ? -1 : 1; // Required fields first
    }
    return a.localeCompare(b); // Then sort alphabetically
  });

  for (const fieldName of allFieldNames) {
    const fieldSchema = jsonSchema.properties[fieldName];
    const isRequired = requiredSet.has(fieldName);

    config[fieldName] = {
      name: fieldNameToDisplayName(fieldName),
      description: getFieldDescription(
        fieldName,
        (fieldSchema as any).description,
      ),
      type: normalizeFieldType(fieldSchema),
      required: isRequired,
    };
  }

  return config;
}

function _processParameters(
  parameters: any[],
  paramIn: "path" | "query",
  properties: Record<string, any>,
  required: string[],
) {
  if (!parameters) return;

  parameters.forEach((param: any) => {
    if (param.in === paramIn && !isIgnoredParam(param.name)) {
      const paramSchema = param.schema || { type: "string" };
      if (param.description) {
        paramSchema.description = param.description;
      }
      properties[param.name] = paramSchema;
      if (param.required) {
        required.push(param.name);
      }
    }
  });
}

function getInputSchema(path: string, method: string) {
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    return {};
  }

  const operation = endpoint[method];
  const properties: Record<string, any> = {};
  const required: string[] = [];

  // Process path and query parameters
  _processParameters(operation.parameters, "path", properties, required);
  _processParameters(operation.parameters, "query", properties, required);

  // Add request body properties
  if (
    operation.requestBody?.content?.["application/json"]?.schema?.properties
  ) {
    const bodySchema = operation.requestBody.content["application/json"].schema;
    Object.entries(bodySchema.properties).forEach(([key, value]) => {
      if (!isIgnoredParam(key)) {
        properties[key] = value;
      }
    });

    if (bodySchema.required) {
      bodySchema.required.forEach((field: string) => {
        if (!isIgnoredParam(field)) {
          required.push(field);
        }
      });
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

function parseEndpoint(endpoint: string): { path: string; method: string } {
  const [method, path] = endpoint.split(" ");
  return { path, method: method.toLowerCase() };
}

/**
 * Converts a JavaScript object to a TypeScript object literal string
 */
function objectToTsString(obj: any, indent = 0): string {
  if (obj === null) return "null";
  if (typeof obj === "string") {
    return `"${JSON.stringify(obj).slice(1, -1)}"`;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const items = obj.map((item) => objectToTsString(item, indent + 2));
    return `[\n${" ".repeat(indent + 2)}${items.join(`,\n${" ".repeat(indent + 2)}`)}\n${" ".repeat(indent)}]`;
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const props = entries.map(([key, value]) => {
      const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      return `${" ".repeat(indent + 2)}${quotedKey}: ${objectToTsString(value, indent + 2)}`;
    });
    return `{\n${props.join(",\n")}\n${" ".repeat(indent)}}`;
  }
  return "undefined";
}

function extractPathParams(path: string): string[] {
  const matches = path.match(/{([^}]+)}/g);
  return matches ? matches.map((match) => match.slice(1, -1)) : [];
}

function needsCustomTaskIds(actionName: string, pathParams: string[]): boolean {
  return (
    actionName.toLowerCase().includes("task") ||
    pathParams.includes("task_id") ||
    actionName.toLowerCase().includes("comment")
  );
}

interface ActionTemplateData {
  actionName: string;
  description: string;
  category: string;
  imports: string;
  inputSchemaTs: string;
  outputSchemaTs: string;
  destructureString: string;
  urlConstruction: string;
  methodOptions: string;
}

function generateActionFileTemplate(data: ActionTemplateData): string {
  const {
    actionName,
    description,
    category,
    imports,
    inputSchemaTs,
    outputSchemaTs,
    destructureString,
    urlConstruction,
    methodOptions,
  } = data;

  return `import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
${imports}

// Input schema for ${fieldNameToDisplayName(actionName)}
const inputSchema = ${inputSchemaTs} as Record<string, AppBlockInputConfigField>;

// Output schema for ${fieldNameToDisplayName(actionName)}
const outputSchema = ${outputSchemaTs} as Type;

export default {
  name: "${fieldNameToDisplayName(actionName)}",
  description: "${description}",
  category: "${category}",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        ${destructureString}${urlConstruction}

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            ${methodOptions}
          )
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
`;
}

function generateActionFile(
  actionName: string,
  path: string,
  method: string,
  category: string,
  inputSchema: any,
  outputSchema: any,
): string {
  const httpMethod = method.toUpperCase();
  const pathParams = extractPathParams(path);
  const needsCustomTaskIdsParam = needsCustomTaskIds(actionName, pathParams);
  const hasBody = ["post", "put", "patch"].includes(method.toLowerCase());

  // Ensure custom_task_ids exists in the schema if we plan to read it.
  if (needsCustomTaskIdsParam && !inputSchema[CUSTOM_TASK_IDS_FIELD]) {
    inputSchema[CUSTOM_TASK_IDS_FIELD] = {
      name: "Custom Task IDs",
      description:
        "If you want to reference a task by its custom task id, this value must be `true`.",
      type: "boolean",
      required: false,
    };
  }

  // Convert path to template literal format, handling team_id specially
  let pathTemplate = path.replace(/{([^}]+)}/g, "${$1}");
  pathTemplate = pathTemplate.replace(
    "${team_id}",
    "${input.app.signals.teamId}",
  );

  // Determine what parameters to destructure
  const destructureParams = pathParams.filter((param) => param !== "team_id");
  if (needsCustomTaskIdsParam) {
    destructureParams.push("custom_task_ids");
  }

  let destructureString = "";
  if (destructureParams.length > 0 && hasBody) {
    destructureString = `const { ${destructureParams.join(", ")}, ...inputData } = input.event.inputConfig;`;
  } else if (destructureParams.length > 0) {
    destructureString = `const { ${destructureParams.join(", ")} } = input.event.inputConfig;`;
  } else if (hasBody) {
    destructureString = `const inputData = input.event.inputConfig;`;
  }

  const urlConstruction = needsCustomTaskIdsParam
    ? `
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? \`${pathTemplate}?\${queryString}\`
          : \`${pathTemplate}\`;`
    : `
        const endpoint = \`${pathTemplate}\`;`;

  const methodOptions = hasBody
    ? `{\n              method: "${httpMethod}",\n              body: filterDefinedParams(inputData),\n            }`
    : `{ method: "${httpMethod}" }`;

  const imports = hasBody
    ? `import { makeClickUpApiRequest, filterDefinedParams } from "../../utils/apiHelpers.ts";`
    : `import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";`;

  const operationMap: Record<string, string> = {
    get: "Retrieves",
    post: "Creates",
    put: "Updates",
    delete: "Deletes",
  };
  const operation = operationMap[method] || "Manages";
  const description = `${operation} ${fieldNameToDisplayName(actionName).toLowerCase()} in ClickUp`;

  const templateData: ActionTemplateData = {
    actionName,
    description,
    category,
    imports,
    inputSchemaTs: objectToTsString(inputSchema),
    outputSchemaTs: objectToTsString(outputSchema),
    destructureString,
    urlConstruction,
    methodOptions,
  };

  return generateActionFileTemplate(templateData);
}

async function writeActionFile(
  category: string,
  actionName: string,
  content: string,
): Promise<void> {
  const fileName = `${actionName}.ts`;
  const filePath = `${ACTIONS_DIR}/${category}/${fileName}`;
  const fullDirPath = join(process.cwd(), `${ACTIONS_DIR}/${category}`);

  await mkdir(fullDirPath, { recursive: true });
  await writeFile(join(process.cwd(), filePath), content);
  console.log(`Generated action: ${filePath}`);
}

interface ActionConfig {
  successCode?: string;
}

const ACTION_CONFIGS: Record<string, ActionConfig> = {
  deleteTask: { successCode: "204" },
};

function getActionConfig(actionName: string): ActionConfig {
  return ACTION_CONFIGS[actionName] || {};
}

async function generateActionWithSchemas(
  actionName: string,
  path: string,
  method: string,
  category: string,
) {
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    console.warn(`Could not find operation for ${path} ${method}`);
    return;
  }

  const actionConfig = getActionConfig(actionName);
  const statusCode = actionConfig.successCode || "200";

  const outputSchemaRaw = (schema.paths as any)[path]?.[method]?.responses?.[
    statusCode
  ]?.content?.["application/json"]?.schema;

  const outputSchema = outputSchemaRaw
    ? cleanOutputSchema(outputSchemaRaw)
    : {};

  const inputSchemaNode = getInputSchema(path, method);
  const inputSchema =
    !inputSchemaNode || Object.keys(inputSchemaNode).length === 0
      ? {}
      : convertJsonSchemaToAppBlockConfig(cleanSchema(inputSchemaNode));

  const actionContent = generateActionFile(
    actionName,
    path,
    method,
    category,
    inputSchema,
    outputSchema,
  );
  await writeActionFile(toCamelCase(category), actionName, actionContent);
}

async function generateActionsIndex(
  actionsByCategory: Record<string, string[]>,
) {
  const imports: string[] = [];
  const allActions: string[] = [];

  const sortedCategories = Object.keys(actionsByCategory).sort();

  for (const category of sortedCategories) {
    const actions = actionsByCategory[category].sort();

    for (const actionName of actions) {
      imports.push(
        `import ${actionName} from "./${toCamelCase(category)}/${actionName}.ts";`,
      );
      allActions.push(`  ${actionName}`);
    }
  }

  const exportObject = `export const actions = {\n${allActions.join(",\n")},\n};`;

  const indexContent = `${imports.join("\n")}\n\n${exportObject}\n`;

  const indexPath = `${ACTIONS_DIR}/index.ts`;
  await writeFile(join(process.cwd(), indexPath), indexContent);
  console.log(`Generated actions index: ${indexPath}`);
}

const actionsByCategory: Record<string, string[]> = {};

for (const [actionName, endpointString] of Object.entries(schemaDefinitions)) {
  const { path, method } = parseEndpoint(endpointString);

  const endpoint = (schema.paths as any)[path];
  if (
    endpoint &&
    endpoint[method] &&
    endpoint[method].tags &&
    endpoint[method].tags.length > 0
  ) {
    const category = endpoint[method].tags[0];
    if (!actionsByCategory[category]) {
      actionsByCategory[category] = [];
    }
    actionsByCategory[category].push(actionName);

    await generateActionWithSchemas(actionName, path, method, category);
  }
}

await generateActionsIndex(actionsByCategory);
