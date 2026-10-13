import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-night text-night-text">
        <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <p className="text-[15px] text-night-muted">Klaida 404</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance">
            Tokio puslapio nėra.
          </h1>
          <p className="mt-4 text-[1.125rem] text-night-muted">
            Gal nuoroda pasikeitė. Grįžkite į pradžią ir rasite viską vienoje vietoje.
          </p>
          <Link href="/" className={`${buttonClass()} mt-9`}>
            Į pradžią
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
