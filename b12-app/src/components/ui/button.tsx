import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-navy text-paper hover:bg-navy-mid",
  gold: "bg-gold text-navy hover:bg-gold-soft",
  outline: "border border-line bg-card text-ink hover:bg-paper",
  ghost: "text-muted hover:text-ink hover:bg-paper",
  danger: "bg-danger text-paper hover:opacity-90",
} as const;

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
