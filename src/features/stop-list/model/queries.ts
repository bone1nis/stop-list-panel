import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { fetchMenuItems } from "./api";
import type { ListFilters } from "./filters";

export const menuKeys = {
  all: ["menu-items"] as const,
  list: (filters: ListFilters) => [...menuKeys.all, filters] as const,
};

export function menuListOptions(filters: ListFilters) {
  return queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
    placeholderData: keepPreviousData,
  });
}
