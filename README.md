# Pyramid Explorer

An interactive 3D globe of 57 pyramids and pyramid-like structures around the world: Egypt, Mesoamerica, Sudan, China, Europe and more. Pick a marker to see dimensions, dating, function, local legends and references. Each entry lists the mainstream view and, where they exist, alternative or contested hypotheses, kept separate.

| Desktop | Mobile |
| --- | --- |
| ![Globe on desktop](docs/screenshots/home-1280.png) | ![Globe on mobile](docs/screenshots/home-360.png) |

## Features

- 3D globe (three.js via globe.gl) with drag, pinch and scroll zoom, slow auto-rotation, and day/night lighting from the real sun position.
- Fly-to animation when a site is picked from the globe or from the list.
- Filters by continent, height, area, free text, "contested" and "Osmanagich focus" flags.
- Detail panel with photo carousel and official vs. alternative information.
- Six languages, interface and data: EN, IT, ES, FR, DE, PT. Picks the browser language on first visit. Site names and descriptions are translated per language (`src/data/locales/`), with the names each language actually uses (Khufu/Cheops, Chephren, Mykérinos…).
- Works on phones: the panel becomes a drawer, and the globe uses a lighter 2K texture, no bump map and a capped pixel ratio.
- No WebGL? A flat world map with the same markers is shown instead.
- Respects `prefers-reduced-motion` (no auto-rotation) and pauses rendering while the tab is hidden.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, framer-motion, three.js + react-globe.gl, Vitest + Testing Library. Static site, no backend: the dataset is `src/data/pyramids.json` (Italian source text) plus one translation overlay per language in `src/data/locales/`. Hosted on Vercel.

## Run locally

```bash
bun install      # or npm install
bun run dev      # http://localhost:8080
bun run test
bun run build
```

No environment variables are required.

## Performance notes

three.js and globe.gl are loaded lazily, after first paint. The initial JS is about 585 kB (176 kB gzipped, English data included); the globe chunk and the other languages (about 9 kB gzipped each) load afterwards. Earth textures are self-hosted WebP files in `public/textures`, derived from the three-globe example images: about 150 kB on mobile and 540 kB on desktop, instead of roughly 2.7 MB from a CDN.

## Project status

Personal project, in active development. The dataset is curated by hand and mixes mainstream archaeology with alternative claims, which are labelled as such. Coordinates, heights and dates were checked against Wikipedia and Wikidata; corrections and open questions are listed in [docs/DATASET_AUDIT.md](docs/DATASET_AUDIT.md) (Italian). Next steps: [docs/ROADMAP.md](docs/ROADMAP.md).
