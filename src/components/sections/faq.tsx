import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

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
    <section id="duk" aria-labelledby="duk-title" className="scroll-mt-14 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading id="duk-title" eyebrow="DUK" title="Dažni klausimai." />
        <Reveal className="mt-12 border-t border-line">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 rounded-lg py-5 text-[1.1875rem] font-medium tracking-[-0.01em] transition-colors hover:text-tomato-dark">
                {item.q}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45 group-open:bg-ink group-open:text-white"
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
    </section>
  );
}
