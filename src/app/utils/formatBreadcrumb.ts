export const formatArticleBreadcrumb = (slug: string) => {
  if (!slug) return "";

  let cleanSlug = slug.replace(/\d+$/, "");

  cleanSlug = cleanSlug.replace(/[.]+ /g, "").replace(/[.]/g, "");

  cleanSlug = cleanSlug.replace(/-+/g, "-");

  return cleanSlug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      return (
        word.charAt(0).toLocaleUpperCase("az-AZ") +
        word.slice(1).toLocaleLowerCase("az-AZ")
      );
    })
    .join(" ");
};
