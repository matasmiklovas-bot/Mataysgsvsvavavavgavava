/**
 * Shared button styles: one shape, one height scale and the same states (hover, pressed,
 * keyboard focus, disabled) everywhere. Primary is the single red action in a view;
 * secondary is a quiet outlined control for the less important choice.
 */
type ButtonOptions = {
  variant?: "primary" | "secondary";
  /** Surface the button sits on; secondary buttons change their outline to match. */
  on?: "light" | "dark";
  size?: "sm" | "lg";
  /** Stretch to the container width on phones only. */
  fullOnMobile?: boolean;
  /** Always stretch to the container width. */
  full?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap select-none " +
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-55";

const variants = {
  primary: { light: "bg-tomato text-white hover:bg-tomato-dark", dark: "bg-tomato text-white hover:bg-tomato-dark" },
  secondary: {
    light: "text-ink ring-1 ring-ink/15 ring-inset hover:bg-white hover:ring-ink/30",
    dark: "text-night-text ring-1 ring-white/20 ring-inset hover:bg-white/[0.06] hover:ring-white/35",
  },
};

const sizes = {
  sm: "h-10 px-4 text-[14px]",
  lg: "h-12 px-6 text-[1rem]",
};

export function buttonClass({
  variant = "primary",
  on = "light",
  size = "lg",
  fullOnMobile = false,
  full = false,
}: ButtonOptions = {}) {
  const width = full ? "w-full" : fullOnMobile ? "w-full sm:w-auto" : "";
  return `${base} ${variants[variant][on]} ${sizes[size]} ${width}`.trim();
}
