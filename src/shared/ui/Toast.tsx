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
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed right-6 bottom-6 z-50 flex w-80 flex-col gap-2"
      role="region"
      aria-label="Уведомления"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
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
        </div>
      ))}
    </div>
  );
}
