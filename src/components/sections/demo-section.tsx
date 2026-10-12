import { guestTable } from "@/lib/data";
import { Demo } from "@/components/demo/demo";

export function DemoSection() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-16 bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12">
          <h2
            id="demo-title"
            className="font-display text-[2.25rem] leading-[1.02] font-bold text-balance sm:text-[3rem] lg:text-[3.4rem]"
          >
            Užsisakykite patys, lyg sėdėtumėte prie {guestTable} staliuko
          </h2>
          <div className="max-w-[34rem] text-[1.0625rem] text-ink-2">
            <p>
              Įsidėkite patiekalą, pažymėkite pastabą virtuvei ir pasirinkite, kaip mokėsite. Tada
              pažiūrėkite, kur užsakymas atsiduria ir ką mato padavėjas.
            </p>
            <p className="mt-3 text-[16px]">
              Tai interaktyvi demonstracija: užsakymai niekur nesiunčiami, pinigai nenuskaitomi.
            </p>
          </div>
        </div>
        <div className="mt-8 sm:mt-10">
          <Demo />
        </div>
      </div>
    </section>
  );
}
