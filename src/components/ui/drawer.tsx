"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible side drawer built on the native <dialog> element:
 * showModal() gives focus trapping, ESC-to-close and an inert background for free.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  closeLabel,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  side?: "left" | "right";
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes the drawer.
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="drawer-title"
      className={cn(
        "bg-ivory text-ink shadow-drawer backdrop:bg-navy-900/45 fixed inset-y-0 m-0 h-dvh max-h-dvh w-[min(26rem,100vw-2.5rem)] max-w-none p-0 backdrop:backdrop-blur-[2px] open:flex open:flex-col",
        side === "right"
          ? "open:animate-slide-in-right right-0 left-auto"
          : "open:animate-slide-in-left left-0",
        className,
      )}
    >
      <div className="border-line flex items-center justify-between border-b px-5 py-4">
        <h2 id="drawer-title" className="font-display text-xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-navy hover:bg-navy/[0.06] -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-sm"
          aria-label={closeLabel}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {footer && <div className="border-line border-t bg-white px-5 py-4">{footer}</div>}
    </dialog>
  );
}
