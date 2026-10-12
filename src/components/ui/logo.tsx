import { siteConfig } from "@/config/site";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#logo-g)" />
      <rect x="1.5" y="1.5" width="29" height="29" rx="8.5" fill="none" stroke="white" strokeOpacity=".35" />
      <rect x="8" y="8" width="7" height="7" rx="2" fill="#0b0b0f" />
      <rect x="17" y="8" width="7" height="7" rx="2" fill="#0b0b0f" />
      <rect x="8" y="17" width="7" height="7" rx="2" fill="#0b0b0f" />
      <rect x="18.5" y="18.5" width="4" height="4" rx="1.2" fill="#0b0b0f" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight text-fg">{siteConfig.name}</span>
    </span>
  );
}
