import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary-strong text-card hover:bg-primary-strong/90",
  secondary: "border border-line bg-card hover:bg-background",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}
