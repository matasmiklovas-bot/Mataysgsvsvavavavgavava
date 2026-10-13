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

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-60";

const primary =
  "bg-tomato text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_10px_24px_-14px_rgb(198_61_36/0.9)] " +
  "hover:bg-tomato-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_16px_30px_-14px_rgb(198_61_36/0.95)]";

const sizes = {
  sm: "h-10 px-4 text-[14px]",
  lg: "h-13 px-8 text-[1.0625rem]",
};

export function buttonClass({ size = "lg", fullOnMobile = false, full = false }: ButtonOptions = {}) {
  const width = full ? "w-full" : fullOnMobile ? "w-full sm:w-auto" : "";
  return `${base} ${primary} ${sizes[size]} ${width}`.trim();
}
