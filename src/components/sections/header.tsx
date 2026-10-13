import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NavLinks } from "@/components/nav-links";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center" aria-label={`${siteConfig.name}, į pradžią`}>
          <Logo tone="light" />
        </Link>
        <nav aria-label="Pagrindinė navigacija" className="hidden md:block">
          <NavLinks />
        </nav>
        <Link
          href="/#forma"
          className="inline-flex h-10 items-center rounded-full bg-tomato px-4 text-[14px] font-medium text-white transition-[background-color,transform] hover:bg-tomato-dark active:scale-[0.98]"
        >
          <span className="sm:hidden">{siteConfig.ctaShort}</span>
          <span className="max-sm:hidden">{siteConfig.cta}</span>
        </Link>
      </div>
    </header>
  );
}
