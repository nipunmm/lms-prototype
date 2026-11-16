import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/40 disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/30",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/40 disabled:opacity-50 aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 disabled:opacity-50 aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-foreground mb-1.5", className)} {...props} />;
}

export function Field({
  label,
  children,
  hint,
  error,
  required,
  id,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  const child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        id: id ?? (children as any).props?.id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy ?? (children as any).props?.["aria-describedby"],
        required: required ?? (children as any).props?.required,
      })
    : children;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}{required ? <span className="text-danger"> *</span> : null}</Label>
      {child}
      {error ? <p id={id ? `${id}-error` : undefined} className="text-xs text-danger mt-1">{error}</p> : null}
      {hint ? <p id={id ? `${id}-hint` : undefined} className="text-xs text-muted-foreground mt-1">{hint}</p> : null}
    </div>
  );
}
