"use client";

import { useQuery } from "@tanstack/react-query";
import type { ListFilters } from "@/features/stop-list/model/filters";
import { menuListOptions } from "@/features/stop-list/model/queries";
import { Filters } from "@/features/stop-list/ui/Filters";

export function StopList({ filters }: { filters: ListFilters }) {
  const query = useQuery(menuListOptions(filters));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Стоп-лист</h1>
      <Filters />
      {query.isPending ? <p>Загрузка…</p> : null}
      {query.isError ? <p>Не удалось загрузить меню</p> : null}
      {query.data ? (
        <ul className="list-disc pl-5">
          {query.data.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
