import { siteConfig } from "@/config/site";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#f2f1ee" />
      <rect x="7.5" y="7.5" width="7" height="7" rx="1.6" fill="#08080a" />
      <rect x="17.5" y="7.5" width="7" height="7" rx="1.6" fill="#08080a" />
      <rect x="7.5" y="17.5" width="7" height="7" rx="1.6" fill="#08080a" />
      <rect x="18.5" y="18.5" width="5" height="5" rx="1.2" fill="#7c5cf0" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">{siteConfig.name}</span>
    </span>
  );
}
