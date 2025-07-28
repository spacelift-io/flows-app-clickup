function toCamelCase(str: string) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function convertKeysToCamelCase(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);

    // Special handling for 'required' arrays - convert field names to camelCase
    if (key === "required" && Array.isArray(value)) {
      result[camelKey] = value.map((field: string) => toCamelCase(field));
    } else {
      result[camelKey] = convertKeysToCamelCase(value);
    }
  }

  return result;
}
