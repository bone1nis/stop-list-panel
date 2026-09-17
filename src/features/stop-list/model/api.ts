import type { MenuItem } from "@/entities/menu-item";
import type { ListFilters } from "./filters";
import { filtersToSearch } from "./filters";

async function readMessage(response: Response, fallback: string) {
  const body: unknown = await response.json().catch(() => null);
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }
  return fallback;
}

export async function fetchMenuItems(
  filters: ListFilters,
): Promise<MenuItem[]> {
  const query = filtersToSearch(filters);
  const response = await fetch(
    query ? `/api/menu-items?${query}` : "/api/menu-items",
  );
  if (!response.ok) {
    throw new Error(await readMessage(response, "Не удалось загрузить меню"));
  }
  return (await response.json()) as MenuItem[];
}
