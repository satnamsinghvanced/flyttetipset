export function capitalizeTitle(slug: string): string {
  if (!slug || typeof slug !== "string") return "";

  const text = slug
    .replace(/_/g, "-")
    .split("-")
    .filter(Boolean)
    .join(" ");

  return text.charAt(0).toUpperCase() + text.slice(1);
}
