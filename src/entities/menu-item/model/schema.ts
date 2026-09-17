import { z } from "zod";

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

export const shopSchema = z.enum(["kitchen", "bar", "pastry"]);
export const statusFilterSchema = z.enum(["available", "stopped"]);
export const stopReasonSchema = z.enum([
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
]);

export function validateUntil(
  value: string | null,
  now = Date.now(),
): string | null {
  if (value === null) return null;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return "Некорректное время";
  if (ts <= now) return "Время должно быть в будущем";
  if (ts - now > MAX_AHEAD_MS) return "Не больше чем на 24 часа вперёд";
  if (ts % STEP_MS !== 0) return "Шаг — 15 минут";
  return null;
}

export const stopItemPayloadSchema = z
  .object({
    reason: stopReasonSchema,
    until: z.union([z.string(), z.null()]),
  })
  .superRefine((value, ctx) => {
    const message = validateUntil(value.until);
    if (message) {
      ctx.addIssue({ code: "custom", message, path: ["until"] });
    }
  });
