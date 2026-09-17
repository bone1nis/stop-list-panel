import type { Shop, StatusFilter } from "@/entities/menu-item";
import { shopSchema, statusFilterSchema } from "@/entities/menu-item";

export interface ListFilters {
  shop?: Shop;
  status?: StatusFilter;
}

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseFilters(input: {
  shop?: string | string[];
  status?: string | string[];
}): ListFilters {
  const shop = shopSchema.safeParse(first(input.shop));
  const status = statusFilterSchema.safeParse(first(input.status));
  return {
    shop: shop.success ? shop.data : undefined,
    status: status.success ? status.data : undefined,
  };
}

export function filtersToSearch(filters: ListFilters): string {
  const params = new URLSearchParams();
  if (filters.shop) params.set("shop", filters.shop);
  if (filters.status) params.set("status", filters.status);
  return params.toString();
}
