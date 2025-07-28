export function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

export function fieldNameToDisplayName(fieldName: string): string {
  // First normalize snake_case to camelCase, then convert to Title Case
  const camelCased = fieldName.replace(/_(\w)/g, (_, letter) =>
    letter.toUpperCase(),
  );

  return camelCased
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/ Id$/, " ID")
    .replace(/ Ids$/, " IDs")
    .replace(/ Url$/, " URL")
    .replace(/ Urls$/, " URLs")
    .trim();
}
