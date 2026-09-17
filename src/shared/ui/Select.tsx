"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import ChevronDown from "@/shared/ui/icons/chevron-down.svg";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  describedBy?: string;
  overlay?: boolean;
}

export function Select({
  value,
  options,
  onChange,
  onBlur,
  invalid,
  disabled,
  className,
  id,
  describedBy,
  overlay = true,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const selected = options.find((option) => option.value === value);

  function close() {
    setOpen(false);
    onBlur?.();
  }

  function openList() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
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

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        id={buttonId}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open ? `${listId}-option-${activeIndex}` : undefined
        }
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-sm text-foreground outline-none select-none focus:ring-0 focus:outline-none",
          invalid ? "border-accent" : "border-[#d9d3c9]",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={() => {
          if (disabled) return;
          if (open) {
            close();
            return;
          }
          openList();
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            close();
            return;
          }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
              openList();
              return;
            }
            setActiveIndex((index) => {
              if (event.key === "ArrowDown") {
                return Math.min(index + 1, options.length - 1);
              }
              return Math.max(index - 1, 0);
            });
          }
          if (open && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            choose(activeIndex);
          }
        }}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-[#5c574e] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          className={cn(
            "mt-1 overflow-hidden rounded-lg border border-[#e4ded4] bg-white py-1",
            overlay && "absolute top-full left-0 z-20 w-full shadow-lg",
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm select-none",
                index === activeIndex && "bg-accent/5",
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                choose(index);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
