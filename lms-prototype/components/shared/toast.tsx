"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info, X } from "lucide-react";

type Toast = { id: number; message: string; tone: "info" | "success" };

let toasts: Toast[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit() {
  listeners.forEach((l) => l());
}

export function toast(message: string, tone: "info" | "success" = "success") {
  const id = ++counter;
  toasts = [...toasts, { id, message, tone }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3500);
}

export function Toaster() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-lg animate-in",
          )}
        >
          {t.tone === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <Info className="h-4 w-4 text-primary" />
          )}
          <span className="max-w-xs">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
