# Stalas — QR užsakymų sistemos svetainė

Vieno puslapio prezentacinė svetainė QR restoranų užsakymų sistemai: hero sekcija su portretu ir
plaukiojančiais UI elementais, „Kaip veikia“ žingsniai, interaktyvi demonstracija (meniu, krepšelis,
mokėjimo būdas, virtuvės / baro / personalo ekranai), naudos, kainodara ir užklausos forma.

## Technologijos

- Next.js 16 (App Router, Cache Components), React 19, TypeScript
- Tailwind CSS 4
- `lucide-react` ikonos, `qrcode` (tikras, nuskaitomas QR kodas generuojamas serveryje)

## Paleidimas

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Konfigūracija

Prekės ženklo pavadinimas, kainos ir nuorodos — `src/config/site.ts`.

Aplinkos kintamieji (žr. `.env.example`):

| Kintamasis | Paskirtis |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Svetainės adresas (canonical, Open Graph, `robots.txt`, `sitemap.xml`, QR kodas hero sekcijoje). |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Neprivaloma. Adresas, priimantis formos JSON `POST` užklausą. Kol nenustatytas, forma veikia **demonstraciniu režimu** ir nieko nesiunčia. |

## Svarbu

- Demonstracija veikia tik naršyklėje: užsakymai niekur nesiunčiami, mokėjimai nevykdomi.
- Nuotraukos kraunamos iš Unsplash CDN (`images.unsplash.com`, Unsplash licencija). Jei nuotrauka
  nepasiekiama, rodoma atsarginė vizualizacija. Nuotraukas galima pakeisti `src/lib/images.ts` ir
  `src/lib/menu.ts`.
- Svetainėje nėra išgalvotų atsiliepimų, statistikos ar integracijų.

## Struktūra

```
src/
  app/                 layout, puslapis, OG paveikslėlis, robots, sitemap, ikona
  components/
    sections/          puslapio sekcijos (header, hero, how-it-works, demo, benefits, pricing, contact, footer)
    demo/              interaktyvios demonstracijos būsena ir vaizdai
    ui/                bendri komponentai (mygtukai, nuotraukos, QR, animacijos)
  config/site.ts       pavadinimas, URL, kainos, navigacija
  lib/                 meniu duomenys, nuotraukų loader'is
```
