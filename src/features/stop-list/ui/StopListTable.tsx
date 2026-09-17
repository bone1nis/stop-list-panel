"use client";

import { motion, useReducedMotion } from "motion/react";
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
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-x-auto rounded-xl border border-[#e4ded4] bg-white">
      <table className="w-full min-w-[960px] table-fixed text-left text-sm">
        <caption className="sr-only">Позиции стоп-листа</caption>
        <colgroup>
          <col className="w-[18%]" />
          <col className="w-[12%]" />
          <col className="w-[8%]" />
          <col className="w-[14%]" />
          <col className="w-[24%]" />
          <col className="w-[24%]" />
        </colgroup>
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
              <motion.tr
                key={item.id}
                initial={false}
                animate={{ opacity: stopped ? 0.55 : 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className={cn(
                  "border-b border-[#f0ebe3] last:border-0",
                  selectedId === item.id && "bg-accent/5",
                )}
              >
                <td className="truncate px-4 py-3 font-medium">{item.title}</td>
                <td className="truncate px-4 py-3">{shopLabels[item.shop]}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">
                  <Badge muted={!stopped}>
                    {statusFilterLabels[item.status.kind]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[#5c574e]">
                  <span className="block min-h-10">
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
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      className="w-[6.75rem]"
                      loading={pending}
                      aria-label={
                        stopped
                          ? `Изменить стоп: ${item.title}`
                          : `Поставить в стоп: ${item.title}`
                      }
                      onClick={() => onSelect(item.id)}
                    >
                      {stopped ? "Изменить" : "В стоп"}
                    </Button>
                    <Button
                      variant="danger"
                      className={cn("w-[11.5rem]", !stopped && "invisible")}
                      disabled={!stopped || resumeDisabled || pending}
                      tabIndex={stopped ? undefined : -1}
                      aria-hidden={!stopped}
                      title={
                        resumeDisabled
                          ? "Нельзя вернуть в продажу: остаток 0"
                          : undefined
                      }
                      aria-label={
                        stopped ? `Вернуть в продажу: ${item.title}` : undefined
                      }
                      onClick={() => onResume(item.id)}
                    >
                      Вернуть в продажу
                    </Button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
