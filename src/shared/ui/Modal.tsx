"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";

const ModalContext = createContext<{
  onClose: () => void;
  contentRef: RefObject<HTMLDivElement | null>;
} | null>(null);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal.Overlay и Modal.Content только внутри Modal");
  }
  return context;
}

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose, contentRef }}>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
        {children}
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

function ModalOverlay() {
  const { onClose } = useModal();
  return (
    <button
      type="button"
      className="absolute inset-0 cursor-pointer bg-[#171512]/40"
      aria-label="Закрыть"
      onClick={onClose}
    />
  );
}

function ModalContent({
  children,
  className,
  labelledBy,
  describedBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy: string;
  describedBy?: string;
}) {
  const { contentRef } = useModal();
  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      tabIndex={-1}
      className={cn(
        "relative z-10 flex max-h-[min(90dvh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-xl border border-[#e4ded4] bg-white shadow-xl outline-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
