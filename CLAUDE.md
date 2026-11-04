# Pyramid Explorer

Interactive 3D globe of pyramids. Repo `TheJhonni/Pyramid-Explorer-Global`, `main` is live at https://pyramid-explorer-global.vercel.app. Work on a short-lived branch with a preview. Only one session at a time works on this repo.

## Rules
- No production deploy, merge, force push or repo visibility change without Davide's explicit OK for that action. Branch, draft PR and preview only.
- No invented data. A value without a source stays flagged in `campi_senza_fonte`; it is never replaced with an estimate. Do not add a site without an opened source.
- Alternative claims stay separate from mainstream data, labelled as such, and never presented as established.
- Respond to Davide in Italian. UI copy and README in natural English, with translations for it, es, fr, de, pt.
- Do not touch other repos or the portfolio site. If a demo URL or the app name changes, tell Davide: the site links to it.
- Confidentiality: see the project instructions. Do not name private funding sources or unrelated personal activities here.

## Stack and commands
React 18, TypeScript, Vite, Tailwind, Radix dialog and slider, three.js, Vitest. Static site with no backend, on Vercel.
Install with `bun install --frozen-lockfile`: `npm install` currently crashes on this tree.
`bun run dev` · `bun run test` · `npx tsc -p tsconfig.app.json --noEmit` · `bun run lint` · `bun run build` (also prerenders `/site/<id>` pages and the sitemap).

## Data
- `src/data/pyramids.json`: base dataset, text in English. Field names are in Italian for historical reasons.
- `src/data/locales/{it,es,fr,de,pt}.json`: text overlays keyed by site id, loaded on demand.
- `src/data/sitePhotos.json`: Commons file names per site, checked by eye. Author and licence are fetched live from the Commons API and must stay visible next to each photo.
- `src/data/sitePanoramas.json`: 360° panoramas per site, from Commons, checked by eye. `sphere` is a full equirectangular image, `strip` a 360° band with limited tilt. Credits come live from Commons, as for photos.
- `docs/DATA_AUDIT.md`: result of the fact check, with sites flagged or removed.
- Continent values stay as Italian keys (`Europa`, `Nord America`); `tc()` translates them.

## Planet globe
`src/components/Globe3D.tsx` is adapted from the GetLayers Planet scene. Its assets are on Vercel Blob (store `pyramid-explorer-assets`), not in Git. For local work, copy them to `public/planet` and set `VITE_PLANET_ASSETS=/planet` in `.env.local`. Pins come from `latLonToUnit` in `src/utils/geo.ts`. It starts after first paint behind `public/globe-poster-*.webp`, and lowers quality on slow devices. If the default view changes, regenerate the poster.

## URLs
`/site/:id` opens a site. Query params hold filters and `compare=a,b`. Keep these stable: they are shareable.

## Status
See `docs/ROADMAP.md`. The 360° trial and its coverage are in `docs/PHOTO_EXPERIENCE.md`.
