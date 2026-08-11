export function parseListQuery(searchParams: URLSearchParams) {
  return {
    limit: parseInt(searchParams.get("limit") || "10"),
    page: parseInt(searchParams.get("page") || "1"),
    search: searchParams.get("search") || undefined,
    selectedOnly: searchParams.get("selectedOnly") === "true",
    categoryIds: searchParams
      .getAll("categoryIds")
      .map(Number)
      .filter(Number.isFinite),
  };
}
