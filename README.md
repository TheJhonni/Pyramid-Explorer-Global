# Pyramid Explorer

An interactive 3D globe of 104 pyramids and pyramid-like structures around the world: Egypt, Mesoamerica, Sudan, China, Europe and more. Pick a marker to see dimensions, dating, function, local legends and sources. Every site shows how well its data is sourced, and alternative claims are kept apart from mainstream archaeology.

| Desktop | Mobile |
| --- | --- |
| ![Globe on desktop](docs/screenshots/home-1280.png) | ![Globe on mobile](docs/screenshots/home-360.png) |

## Features

- 3D globe (three.js via globe.gl) with drag, pinch and scroll zoom, slow auto-rotation, and day/night lighting from the real sun position.
- Fly-to animation when a site is picked from the globe or from the list.
- Filters by continent, period, height, area, free text, verification and contested status, with sorting.
- Compare sites at the same scale, follow a timeline of construction, or take a guided tour.
- Shareable URLs for sites, filters and comparisons; a prerendered page per site and a sitemap for search engines.
- Detail panel with verification status, sources, photos and clearly separated alternative claims.
- Six languages for both the interface and the site texts: EN, IT, ES, FR, DE, PT.
- Works on phones: the panel becomes a drawer, and the globe uses a lighter 2K texture, no bump map and a capped pixel ratio.
- No WebGL? A flat world map with the same markers is shown instead.
- Respects `prefers-reduced-motion` (no auto-rotation) and pauses rendering while the tab is hidden.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, framer-motion, three.js + react-globe.gl, Vitest + Testing Library. Static site, no backend: the dataset is `src/data/pyramids.json`. Hosted on Vercel.

## Run locally

```bash
bun install --frozen-lockfile
bun run dev      # http://localhost:8080
bun run test
bun run build
```

No environment variables are required.

## Performance notes

three.js and globe.gl are loaded lazily, after first paint. The globe chunk loads afterwards, and site translations load only for the language in use. Earth textures are self-hosted WebP files in `public/textures`, derived from the three-globe example images: about 150 kB on mobile and 540 kB on desktop, instead of roughly 2.7 MB from a CDN.

## Project status

Personal project under active development: see [the roadmap](docs/ROADMAP.md). The data was fact-checked against sources, and the gaps are listed in [the data audit](docs/DATA_AUDIT.md). No value without a source is presented as verified.
