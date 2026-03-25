export default function getInitials(name: string) {
  if (!name || name.length === 0) return "";

  return name
    .trim()
    .split(" ")
    .filter((word) => word !== "")
    .map((word) => word[0].toUpperCase())
    .join("");
}