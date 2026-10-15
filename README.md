# Kvitas: QR užsakymų svetainė

Vieno puslapio svetainė QR užsakymų sistemai restoranams, kavinėms ir barams.
Pagrindinė dalis yra interaktyvi demonstracija: svečio telefonas → virtuvės, baro ir personalo planšetės.

## Technologijos

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. `qrcode` generuoja tikrą QR kodą serveryje.
Šriftai: Geist (visas tekstas), IBM Plex Mono (laikmačiai ir numeriai).

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
| Patiekalų nuotraukos (640×640 WebP) | `public/menu/<id>.webp` |
| Formos siuntimas (Formspree / Web3Forms) | `.env` → `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_FORM_ACCESS_KEY` (žr. `.env.example`) |
| Domenas (QR kodas, OG, sitemap) | `.env` → `NEXT_PUBLIC_SITE_URL` |
| Privatumo politika | `src/app/privatumas/page.tsx` |

Kol formos adresas nenurodytas, mygtukas atidaro lankytojo el. pašto programą su užpildytu laišku
(`siteConfig.contacts.email`).

Neužpildyti kontaktai puslapyje tiesiog nerodomi; kode jie pažymėti komentarais `TODO`.

## Paleidimas (Vercel)

1. `src/config/site.ts` → `contacts`: el. paštas (būtinas: į jį ateina užklausos), telefonas, įmonės pavadinimas ir kodas.
2. [vercel.com](https://vercel.com) → *Add New → Project* → pasirinkite šią GitHub repozitoriją → *Deploy*.
3. *Settings → Environment Variables*:
   - `NEXT_PUBLIC_SITE_URL` = `https://jusu-domenas.lt`
   - formai be el. pašto programos: [web3forms.com](https://web3forms.com) raktas →
     `NEXT_PUBLIC_FORM_ENDPOINT` = `https://api.web3forms.com/submit`, `NEXT_PUBLIC_FORM_ACCESS_KEY` = raktas.
4. *Settings → Domains* → pridėkite domeną ir DNS įrašus, kuriuos parodo Vercel. Tada *Redeploy*.

Nuotraukų licencijos: `src/lib/data.ts`; CC BY nuotraukos autorius rodomas poraštėje.
