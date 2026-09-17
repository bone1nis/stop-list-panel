"use client";

import type { MenuItem } from "@/entities/menu-item";
import {
  shopLabels,
  statusFilterLabels,
  stopReasonLabels,
} from "@/entities/menu-item";
import { Badge, Button } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

function formatUntil(until: string | null) {
  if (!until) return "до конца смены";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(until));
}

interface StopListTableProps {
  items: MenuItem[];
  pendingIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onResume: (id: string) => void;
}

export function StopListTable({
  items,
  pendingIds,
  selectedId,
  onSelect,
  onResume,
}: StopListTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e4ded4] bg-white">
      <table className="w-full min-w-[960px] text-left text-sm">
        <caption className="sr-only">Позиции стоп-листа</caption>
        <thead className="border-b border-[#e4ded4] bg-[#faf7f2] text-xs tracking-wide text-[#5c574e] uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Позиция
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Цех
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Остаток
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Статус
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Стоп
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const stopped = item.status.kind === "stopped";
            const pending = pendingIds.includes(item.id);
            const resumeDisabled = item.stock === 0;
            return (
              <tr
                key={item.id}
                className={cn(
                  "border-b border-[#f0ebe3] last:border-0",
                  stopped && "opacity-55",
                  selectedId === item.id && "bg-accent/5",
                )}
              >
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3">{shopLabels[item.shop]}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge muted={!stopped}>
                      {statusFilterLabels[item.status.kind]}
                    </Badge>
                    {pending ? <Badge>сохраняется</Badge> : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#5c574e]">
                  {item.status.kind === "stopped" ? (
                    <>
                      {stopReasonLabels[item.status.reason]}
                      <span className="block text-xs">
                        {formatUntil(item.status.until)}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      aria-label={
                        stopped
                          ? `Изменить стоп: ${item.title}`
                          : `Поставить в стоп: ${item.title}`
                      }
                      onClick={() => onSelect(item.id)}
                    >
                      {stopped ? "Изменить" : "В стоп"}
                    </Button>
                    {stopped ? (
                      <Button
                        variant="danger"
                        disabled={resumeDisabled}
                        title={
                          resumeDisabled
                            ? "Нельзя вернуть в продажу: остаток 0"
                            : undefined
                        }
                        aria-label={`Вернуть в продажу: ${item.title}`}
                        onClick={() => onResume(item.id)}
                      >
                        Вернуть в продажу
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
