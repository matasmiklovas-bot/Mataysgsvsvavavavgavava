import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-offset-4";

const sizes = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
} as const;

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-white to-[#e7e2ff] text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_10px_30px_-10px_rgba(139,92,246,0.7)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_16px_40px_-10px_rgba(139,92,246,0.9)] hover:-translate-y-0.5",
  secondary:
    "glass text-fg hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5",
  ghost: "text-fg-muted hover:text-fg",
};

type CommonProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: Omit<CommonProps, "children">) {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"a">) {
  return (
    <a {...props} className={buttonClasses({ variant, size, className })}>
      {children}
    </a>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button {...props} type={type} className={buttonClasses({ variant, size, className })}>
      {children}
    </button>
  );
}
