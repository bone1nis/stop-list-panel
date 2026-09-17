"use client";

import { useId } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  shopLabels,
  shopSchema,
  statusFilterLabels,
  statusFilterSchema,
} from "@/entities/menu-item";
import { parseFilters, filtersToSearch } from "../model/filters";
import type { ListFilters } from "../model/filters";
import { Select } from "@/shared/ui";

const shopOptions = [
  { value: "", label: "Все цеха" },
  ...Object.entries(shopLabels).map(([value, label]) => ({ value, label })),
];

const statusOptions = [
  { value: "", label: "Все статусы" },
  ...Object.entries(statusFilterLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shopId = useId();
  const statusId = useId();
  const filters = parseFilters({
    shop: searchParams.get("shop") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  function update(next: ListFilters) {
    const query = filtersToSearch(next);
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex gap-3" role="group" aria-label="Фильтры">
      <div className="flex w-max flex-col gap-1 text-sm">
        <label htmlFor={shopId}>Цех</label>
        <Select
          id={shopId}
          className="w-48"
          value={filters.shop ?? ""}
          options={shopOptions}
          onChange={(value) => {
            const shop = shopSchema.safeParse(value);
            update({
              ...filters,
              shop: shop.success ? shop.data : undefined,
            });
          }}
        />
      </div>
      <div className="flex w-max flex-col gap-1 text-sm">
        <label htmlFor={statusId}>Статус</label>
        <Select
          id={statusId}
          className="w-48"
          value={filters.status ?? ""}
          options={statusOptions}
          onChange={(value) => {
            const status = statusFilterSchema.safeParse(value);
            update({
              ...filters,
              status: status.success ? status.data : undefined,
            });
          }}
        />
      </div>
    </div>
  );
}
