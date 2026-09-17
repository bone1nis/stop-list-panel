"use client";

import { useEffect, useId, useRef, useState } from "react";
import { validateUntil } from "@/entities/menu-item";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import CalendarIcon from "@/shared/ui/icons/calendar.svg";
import ChevronDown from "@/shared/ui/icons/chevron-down.svg";

const STEP_MS = 15 * 60 * 1000;
const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function nextSlot(from = Date.now()) {
  return Math.ceil((from + 1) / STEP_MS) * STEP_MS;
}

function validTimestamps(now = Date.now()) {
  const slots: number[] = [];
  for (let ts = nextSlot(now); ts - now <= MAX_AHEAD_MS; ts += STEP_MS) {
    slots.push(ts);
  }
  return slots;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function monthCells(month: Date) {
  const first = startOfMonth(month);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const leading = (first.getDay() + 6) % 7;
  const cells: Array<Date | null> = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= days; day += 1) {
    cells.push(new Date(first.getFullYear(), first.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatValue(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(ts: number) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  id?: string;
  describedBy?: string;
}

export function DateTimePicker({
  value,
  onChange,
  onBlur,
  invalid,
  id,
  describedBy,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = new Date(value);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));
  const rootRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const dialogId = useId();
  const slots = open ? validTimestamps() : [];

  function close() {
    setOpen(false);
    onBlur?.();
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        onBlur?.();
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, onBlur]);

  const enabledDays = slots.map((ts) => new Date(ts));
  const daySlots = slots.filter((ts) => sameDay(new Date(ts), selected));
  const prevMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() - 1,
    1,
  );
  const nextMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    1,
  );
  const canPrev = enabledDays.some(
    (day) =>
      day.getFullYear() === prevMonth.getFullYear() &&
      day.getMonth() === prevMonth.getMonth(),
  );
  const canNext = enabledDays.some(
    (day) =>
      day.getFullYear() === nextMonth.getFullYear() &&
      day.getMonth() === nextMonth.getMonth(),
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        id={buttonId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-describedby={describedBy}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 text-left text-sm text-foreground outline-none select-none focus:ring-0 focus:outline-none",
          invalid ? "border-accent" : "border-[#d9d3c9]",
        )}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          setViewMonth(startOfMonth(new Date(value)));
          if (validateUntil(value) !== null) {
            onChange(new Date(nextSlot()).toISOString());
          }
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
        }}
      >
        <CalendarIcon aria-hidden className="size-4 shrink-0 text-[#5c574e]" />
        <span className="flex-1 truncate">{formatValue(value)}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-[#5c574e] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id={dialogId}
          role="dialog"
          aria-label="Выбор даты и времени"
          className="mt-2 rounded-lg border border-[#e4ded4] bg-[#faf7f2] p-3"
        >
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <button
                  type="button"
                  className="flex size-7 cursor-pointer items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={!canPrev}
                  aria-label="Предыдущий месяц"
                  onClick={() => setViewMonth(prevMonth)}
                >
                  <ChevronDown aria-hidden className="size-4 rotate-90" />
                </button>
                <p className="text-sm font-medium capitalize">
                  {formatMonth(viewMonth)}
                </p>
                <button
                  type="button"
                  className="flex size-7 cursor-pointer items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={!canNext}
                  aria-label="Следующий месяц"
                  onClick={() => setViewMonth(nextMonth)}
                >
                  <ChevronDown aria-hidden className="size-4 -rotate-90" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] text-[#5c574e]">
                {WEEKDAYS.map((day) => (
                  <span key={day} className="py-0.5">
                    {day}
                  </span>
                ))}
                {monthCells(viewMonth).map((day, index) => {
                  if (!day) {
                    return <span key={`empty-${index}`} />;
                  }
                  const enabled = enabledDays.some((slot) =>
                    sameDay(slot, day),
                  );
                  const current = sameDay(day, selected);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={!enabled}
                      className={cn(
                        "h-7 rounded-md text-sm",
                        enabled && "cursor-pointer hover:bg-white",
                        current && "bg-accent text-white hover:bg-accent",
                        !enabled && "cursor-not-allowed text-[#c9c3b8]",
                      )}
                      onClick={() => {
                        const forDay = slots.filter((ts) =>
                          sameDay(new Date(ts), day),
                        );
                        const keepTime = forDay.find((ts) => {
                          const next = new Date(ts);
                          return (
                            next.getHours() === selected.getHours() &&
                            next.getMinutes() === selected.getMinutes()
                          );
                        });
                        const next = keepTime ?? forDay[0];
                        if (!next) return;
                        onChange(new Date(next).toISOString());
                      }}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex w-20 shrink-0 flex-col">
              <p className="mb-1 text-center text-[11px] text-[#5c574e]">
                Время
              </p>
              <div className="max-h-44 overflow-y-auto">
                {daySlots.map((ts) => {
                  const iso = new Date(ts).toISOString();
                  const current = Date.parse(value) === ts;
                  const valid = validateUntil(iso) === null;
                  return (
                    <button
                      key={ts}
                      type="button"
                      disabled={!valid}
                      className={cn(
                        "mb-0.5 h-7 w-full rounded-md text-xs",
                        valid && "cursor-pointer hover:bg-white",
                        current && "bg-accent text-white hover:bg-accent",
                        !valid && "cursor-not-allowed text-[#c9c3b8]",
                      )}
                      onClick={() => onChange(iso)}
                    >
                      {formatTime(ts)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="button" className="h-8 px-3 text-xs" onClick={close}>
              Сохранить
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
