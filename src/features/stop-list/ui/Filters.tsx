"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  shopLabels,
  shopSchema,
  statusFilterLabels,
  statusFilterSchema,
} from "@/entities/menu-item";
import { filtersToSearch, parseFilters } from "../model/filters";
import type { ListFilters } from "../model/filters";

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseFilters({
    shop: searchParams.get("shop") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  function update(next: ListFilters) {
    const query = filtersToSearch(next);
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Цех
        <select
          className="h-10 rounded border px-3"
          value={filters.shop ?? ""}
          onChange={(event) => {
            const shop = shopSchema.safeParse(event.target.value);
            update({
              ...filters,
              shop: shop.success ? shop.data : undefined,
            });
          }}
        >
          <option value="">Все цеха</option>
          {Object.entries(shopLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Статус
        <select
          className="h-10 rounded border px-3"
          value={filters.status ?? ""}
          onChange={(event) => {
            const status = statusFilterSchema.safeParse(event.target.value);
            update({
              ...filters,
              status: status.success ? status.data : undefined,
            });
          }}
        >
          <option value="">Все статусы</option>
          {Object.entries(statusFilterLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
