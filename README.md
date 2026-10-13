# Kvitas: QR užsakymų svetainė

Vieno puslapio svetainė QR užsakymų sistemai restoranams, kavinėms ir barams.
Pagrindinė dalis yra interaktyvi demonstracija: svečio telefonas → virtuvės, baro ir personalo planšetės.

## Technologijos

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. `qrcode` generuoja tikrą QR kodą serveryje.
Šriftai: Archivo Narrow (antraštės), Hanken Grotesk (tekstas), IBM Plex Mono (tik bilietai ir sąskaita).

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start
```

## Kur ką keisti

| Ką | Kur |
| --- | --- |
| Kaina, kontaktai, įmonės duomenys, mygtuko tekstas | `src/config/site.ts` |
| Meniu, staliukai, užsakymų numeracija, hero bilietas | `src/lib/data.ts` |
| Formos siuntimas (Formspree / Web3Forms) | `.env` → `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_FORM_ACCESS_KEY` (žr. `.env.example`) |
| Domenas (QR kodas, OG, sitemap) | `.env` → `NEXT_PUBLIC_SITE_URL` |
| Privatumo politika | `src/app/privatumas/page.tsx` |

Kol formos adresas nenurodytas, mygtukas atidaro lankytojo el. pašto programą su užpildytu laišku
(`siteConfig.contacts.email`).

Visi neužpildyti dalykai puslapyje pažymėti geltonu `[TODO: …]`, kode komentarais `TODO`.
