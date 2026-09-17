import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export function Badge({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        muted ? "bg-[#ece7df] text-[#5c574e]" : "bg-accent/10 text-accent",
      )}
    >
      {children}
    </span>
  );
}
