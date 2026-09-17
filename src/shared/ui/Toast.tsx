"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "./Button";

interface ToastItem {
  id: string;
  message: string;
}

export function Toast({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.18;

  return (
    <div
      className="fixed right-6 bottom-6 z-50 flex w-80 flex-col gap-2"
      role="region"
      aria-label="Уведомления"
      aria-live="assertive"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            transition={{ duration }}
            className="rounded-lg border border-accent/20 bg-white p-3 text-sm text-foreground shadow-lg"
            role="alert"
          >
            <p>{toast.message}</p>
            <Button
              variant="ghost"
              className="mt-2 h-8 px-2 text-xs"
              onClick={() => onDismiss(toast.id)}
            >
              Закрыть
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
