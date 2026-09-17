import type { MenuItem } from "@/entities/menu-item";

export function replaceItem(
  items: MenuItem[],
  id: string,
  next: MenuItem | undefined,
  index = items.length,
): MenuItem[] {
  if (!next) {
    return items.filter((item) => item.id !== id);
  }
  const current = items.findIndex((item) => item.id === id);
  if (current >= 0) {
    return items.map((item) => (item.id === id ? next : item));
  }
  const at = Math.min(Math.max(index, 0), items.length);
  return [...items.slice(0, at), next, ...items.slice(at)];
}
