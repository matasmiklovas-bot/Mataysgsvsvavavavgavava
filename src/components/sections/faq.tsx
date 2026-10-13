import { Reveal } from "@/components/reveal";
import { sectionTitleClass } from "@/components/section-heading";

/*
  Answers only state what is known about the product and leave specifics for the demo.
  TODO (site owner): replace with exact answers once confirmed (POS, card fees,
  offline mode, launch time, languages, allergens, contract terms).
*/
const faq: { q: string; a: string }[] = [
  {
    q: "Ar reikia pirkti planšetes?",
    a: "Ne. Galite naudoti savas arba nuomotis visą įrangą iš mūsų už 50 € per mėnesį.",
  },
  {
    q: "Kiek kainuoja priežiūra?",
    a: "Nieko. Priežiūra ir visi pakeitimai, kurių paprašysite, nemokami.",
  },
  {
    q: "Kaip su kasos aparatu ir čekiais?",
    a: "Priklauso nuo jūsų kasos. Pasakykite jos pavadinimą, ir paaiškinsime, kaip viską suderinti.",
  },
  {
    q: "Kokie mokesčiai už mokėjimus kortele?",
    a: "Juos taiko mokėjimų teikėjas. Tikslius įkainius parodysime prieš pasirašant.",
  },
  {
    q: "Kas nutinka, jei dingsta internetas?",
    a: "Užsakymams reikia interneto. Kaip apsidrausti, aptarsime pagal jūsų patalpas.",
  },
  {
    q: "Per kiek laiko viskas paleidžiama?",
    a: "Priklauso nuo meniu dydžio. Tikslų terminą pasakysime, kai pamatysime jūsų meniu.",
  },
  {
    q: "O jei svečias nenori skenuoti?",
    a: "Jis užsisako kaip įprasta, per padavėją. QR yra papildomas būdas, ne vienintelis.",
  },
];

export function Faq() {
  return (
    <section id="duk" aria-labelledby="duk-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="grid gap-y-8 border-t border-line pt-8 sm:pt-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2 id="duk-title" className={sectionTitleClass}>
                Dažni klausimai.
              </h2>
              <p className="mt-4 max-w-[24rem] text-ink-2">
                Neradote atsakymo?{" "}
                <a href="#forma" className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  Parašykite mums
                </a>
                , atsakysime per demonstraciją.
              </p>
            </div>
          </div>
          <Reveal className="border-t border-line lg:col-span-8 lg:border-t-0">
            {faq.map((item) => (
              <details key={item.q} className="group border-b border-line lg:first:-mt-5">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 rounded-control py-5 text-[1.125rem] font-medium tracking-[-0.01em] transition-colors hover:text-ink-2 sm:text-[1.1875rem]">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-line ring-inset transition-[transform,background-color,color,box-shadow] duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45 group-open:bg-ink group-open:text-white group-open:ring-ink"
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-6 text-ink-2">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
