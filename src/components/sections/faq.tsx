import { Reveal } from "@/components/reveal";

/*
  Answers only state what is known about the product and leave specifics for the demo.
  TODO (site owner): replace with exact answers once confirmed (POS, card fees,
  offline mode, launch time, languages, allergens, contract terms).
*/
const faq: { q: string; a: string }[] = [
  {
    q: "Ar reikia pirkti planšetes?",
    a: "Nebūtinai. Galite naudoti savo planšetes arba nuomotis visą reikalingą įrangą iš mūsų už 50 € per mėnesį. Kiek planšečių reikia jūsų salei, pasakysime per demonstraciją.",
  },
  {
    q: "Kiek kainuoja priežiūra?",
    a: "Nieko. Palaikymas neribotas, o meniu, kainų ar kitus pakeitimus, kurių paprašysite, atliekame nemokamai.",
  },
  {
    q: "Kaip su kasos aparatu ir čekiais?",
    a: "Tai priklauso nuo kasos, kurią naudojate dabar. Parašykite jos pavadinimą formoje arba pasakykite pokalbio metu, ir paaiškinsime, kaip viską suderinti.",
  },
  {
    q: "Kokie mokesčiai už mokėjimus kortele?",
    a: "Mokėjimus kortele aptarnauja mokėjimų paslaugų teikėjas, kuris taiko savo įkainius. Kokie jie būtų jūsų restoranui, parodysime prieš pasirašant sutartį.",
  },
  {
    q: "Kas nutinka, jei dingsta internetas?",
    a: "Užsakymai keliauja internetu, todėl salėje, virtuvėje ir bare reikia stabilaus ryšio. Kaip elgtis, jei jis sutriktų, aptarsime pagal jūsų patalpas.",
  },
  {
    q: "Per kiek laiko viskas paleidžiama?",
    a: "Tai priklauso nuo meniu dydžio ir staliukų skaičiaus. Tikslų terminą pasakysime per demonstraciją, kai pamatysime jūsų meniu.",
  },
  {
    q: "Ar galime patys keisti meniu ir kainas?",
    a: "Užtenka parašyti mums, ką pakeisti: naujus patiekalus, kainas ar sezoninį meniu. Visus pakeitimus, kurių paprašysite, atliekame nemokamai.",
  },
  {
    q: "Ar meniu gali būti keliomis kalbomis?",
    a: "Jei pas jus užsuka užsienio svečių, pasakykite, kokių kalbų reikia, ir aptarsime galimybes jūsų restoranui.",
  },
  {
    q: "Ar galima nurodyti alergenus?",
    a: "Prie patiekalo svečias gali pažymėti pastabą, ir ji paryškinta atsiranda virtuvės biliete, kaip „be svogūnų“ demonstracijoje. Kaip meniu pažymėti alergenus, aptarsime kartu.",
  },
  {
    q: "Ar yra minimalus sutarties terminas?",
    a: "Sutarties sąlygas aptariame prieš pasirašant, kad viskas būtų aišku iš anksto. Kaina: 400 € už įdiegimą, 1 € per mėnesį, o jei nuomojatės įrangą, dar 50 € per mėnesį.",
  },
  {
    q: "Ką daryti svečiams, kurie nenori skenuoti?",
    a: "QR užsakymas yra papildomas būdas, ne vienintelis. Svečias visada gali pasikviesti padavėją ir užsisakyti kaip įprasta.",
  },
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
          <p className="mx-auto mt-4 max-w-[30rem] text-[1.125rem] text-ink-2">
            Neradote savo klausimo? Užduokite jį formoje, atsakysime per demonstraciją.
          </p>
        </Reveal>
        <Reveal className="mt-12 border-t border-line">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-[1.1875rem] font-medium tracking-[-0.01em] transition-colors hover:text-tomato-dark">
                {item.q}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-[1.25rem] leading-none text-ink transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-white"
                >
                  +
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
