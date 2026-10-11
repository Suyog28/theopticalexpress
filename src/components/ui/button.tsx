import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-teal text-navy-900 font-semibold hover:bg-teal-deep hover:text-white hover:shadow-lift active:translate-y-px",
  secondary:
    "border border-navy/80 text-navy bg-transparent hover:bg-navy hover:text-white active:translate-y-px",
  ghost: "text-navy hover:bg-navy/[0.06]",
  light: "bg-white text-navy hover:bg-ivory active:translate-y-px",
  link: "text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy px-0 h-auto",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-6 text-[0.9375rem] rounded-full",
  lg: "h-13 px-8 text-base rounded-full",
  icon: "h-10 w-10 rounded-full",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
});
