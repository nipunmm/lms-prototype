import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "muted" | "outline";

const tones: Record<Tone, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  muted: "bg-muted text-muted-foreground border-border",
  outline: "bg-transparent text-foreground border-border",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Tone> = {
    open: "success", active: "success", approved: "success", confirmed: "success", present: "success", delivered: "success",
    pending: "warning", late: "warning", packed: "warning", posted: "info", scheduled: "info",
    full: "danger", rejected: "danger", absent: "danger", reversed: "danger", cancelled: "danger", closed: "muted",
    paused: "warning", ended: "muted", inactive: "muted", excused: "info", live: "danger", completed: "muted", draft: "muted",
    new: "warning", contacted: "info",
  };
  const tone = map[status.toLowerCase()] ?? "muted";
  return <Badge tone={tone} className="capitalize">{status}</Badge>;
}
