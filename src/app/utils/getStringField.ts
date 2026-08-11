export function getStringField(
  fd: FormData,
  key: string,
  fallback = ""
): string {
  const value = fd.get(key);
  return typeof value === "string" ? value : fallback;
}
