"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/shared/lib/cn";
import Check from "@/shared/ui/icons/check.svg";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  name?: string;
  value?: string;
  disabled?: boolean;
  id?: string;
}

export function Checkbox({
  checked,
  onChange,
  children,
  name,
  value,
  disabled,
  id,
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const grouped = Boolean(name);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex cursor-pointer items-center gap-2 text-sm select-none",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <input
        id={inputId}
        type={grouped ? "radio" : "checkbox"}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border",
          checked
            ? "border-accent bg-accent text-white"
            : "border-[#d9d3c9] bg-white",
        )}
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
      {children}
    </label>
  );
}
