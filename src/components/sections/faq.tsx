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
    <section id="duk" aria-labelledby="duk-title" className="scroll-mt-16">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 id="duk-title" className="font-display text-[2.25rem] leading-[1.02] font-bold sm:text-[3rem] lg:text-[3.4rem]">
          Ko dažniausiai klausia savininkai
        </h2>
        <div className="divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-[1.0625rem] font-semibold">
                {item.q}
                <span
                  aria-hidden="true"
                  className="font-display text-[1.75rem] leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="max-w-[60ch] pb-5 text-ink-2">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
