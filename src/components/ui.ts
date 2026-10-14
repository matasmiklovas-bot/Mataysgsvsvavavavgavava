/**
 * Shared button styles, so every call to action has the same shape, depth and states
 * (hover, pressed, keyboard focus, disabled) across the site.
 */
type ButtonOptions = {
  size?: "sm" | "lg";
  /** Stretch to the container width on phones only. */
  fullOnMobile?: boolean;
  /** Always stretch to the container width. */
  full?: boolean;
};

// Tailwind v4 scales with the `scale` property, not `transform`, so it is listed explicitly.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none touch-manipulation " +
  "transition-[background-color,box-shadow,scale] duration-150 ease-out active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none";

const primary =
  "bg-tomato text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(0_0_0/0.18)] hover:bg-tomato-dark";

const sizes = {
  sm: "h-10 px-4 text-[14px]",
  lg: "h-13 px-8 text-[1.0625rem]",
};

export function buttonClass({ size = "lg", fullOnMobile = false, full = false }: ButtonOptions = {}) {
  const width = full ? "w-full" : fullOnMobile ? "w-full sm:w-auto" : "";
  return `${base} ${primary} ${sizes[size]} ${width}`.trim();
}
