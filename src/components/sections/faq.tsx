import { Reveal } from "@/components/reveal";
import type { ReactNode } from "react";

const faq: { q: string; a: ReactNode }[] = [
  {
    q: "Ar reikia pirkti planšetes?",
    a: (
      <>
        Užsakymai rodomi virtuvės, baro ir personalo planšetėse.{" "}
        <span className="todo">[TODO: ar jas perkate patys, ar jos įeina į kainą, kokie modeliai tinka]</span>
      </>
    ),
  },
  { q: "Kaip su kasos aparatu ir čekiais?", a: <span className="todo">[TODO: atsakymas]</span> },
  { q: "Kokie mokesčiai už mokėjimus kortele?", a: <span className="todo">[TODO: mokėjimų tiekėjas ir jo įkainiai]</span> },
  { q: "Kas nutinka, jei dingsta internetas?", a: <span className="todo">[TODO: atsakymas]</span> },
  { q: "Per kiek laiko viskas paleidžiama?", a: <span className="todo">[TODO: terminas nuo sutarties iki pirmo užsakymo]</span> },
  { q: "Ar galime patys keisti meniu ir kainas?", a: <span className="todo">[TODO: atsakymas]</span> },
  { q: "Ar meniu gali būti keliomis kalbomis?", a: <span className="todo">[TODO: atsakymas]</span> },
  { q: "Ar galima nurodyti alergenus?", a: <span className="todo">[TODO: atsakymas]</span> },
  { q: "Ar yra minimalus sutarties terminas?", a: <span className="todo">[TODO: atsakymas]</span> },
  { q: "Ką daryti svečiams, kurie nenori skenuoti?", a: <span className="todo">[TODO: atsakymas]</span> },
];

export function Faq() {
  return (
    <section id="duk" aria-labelledby="duk-title" className="scroll-mt-14 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="text-center">
          <h2
            id="duk-title"
            className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.5rem]"
          >
            Ko dažniausiai klausia savininkai.
          </h2>
        </Reveal>
        <Reveal className="mt-12 border-t border-line">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-[1.1875rem] font-medium tracking-[-0.01em]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-[1.25rem] leading-none transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="max-w-[60ch] pb-6 text-ink-2">{item.a}</div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
