# Pyramid Explorer

Interactive 3D globe of pyramids. Repo `TheJhonni/Pyramid-Explorer-Global`, the only work branch is `improve/portfolio-ready`, draft PR #1. Only one session at a time works on this repo.

## Rules
- No production deploy, merge, force push or repo visibility change without Davide's explicit OK for that action. Branch, draft PR and preview only.
- No invented data. A value without a source stays flagged in `campi_senza_fonte`; it is never replaced with an estimate. Do not add a site without an opened source.
- Alternative claims stay separate from mainstream data, labelled as such, and never presented as established.
- Respond to Davide in Italian. UI copy and README in natural English, with translations for it, es, fr, de, pt.
- Do not touch other repos or the portfolio site. If a demo URL or the app name changes, tell Davide: the site links to it.
- Confidentiality: see the project instructions. Do not name private funding sources or unrelated personal activities here.

## Stack and commands
React 18, TypeScript, Vite, Tailwind, Radix dialog and slider, three.js via react-globe.gl, Vitest. Static site with no backend, on Vercel.
Install with `bun install --frozen-lockfile`: `npm install` currently crashes on this tree.
`bun run dev` · `bun run test` · `npx tsc -p tsconfig.app.json --noEmit` · `bun run lint` · `bun run build` (also prerenders `/site/<id>` pages and the sitemap).

## Data
- `src/data/pyramids.json`: base dataset, text in English. Field names are in Italian for historical reasons.
- `src/data/locales/{it,es,fr,de,pt}.json`: text overlays keyed by site id, loaded on demand.
- `src/data/pyramidImages.ts`: hotlinked Wikimedia images.
- `docs/DATA_AUDIT.md`: result of the fact check, with sites flagged or removed.
- Continent values stay as Italian keys (`Europa`, `Nord America`); `tc()` translates them.

## URLs
`/site/:id` opens a site. Query params hold filters and `compare=a,b`. Keep these stable: they are shareable.

## Status
See `docs/ROADMAP.md`. Photos and the immersive view are next: `docs/PHOTO_EXPERIENCE.md`.
