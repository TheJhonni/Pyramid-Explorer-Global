# Roadmap

## Done on `improve/portfolio-ready`
- Renamed to Pyramid Explorer; neutral labels for mainstream data and alternative claims.
- Fact-checked dataset with status, sources and flagged gaps; new sourced sites.
- Site texts in six languages, with language detection and memory.
- Shareable URLs for sites, filters and comparisons; prerendered site pages and sitemap.
- Scale comparison, timeline, guided tour, period and verification filters, sorting, two-thumb range sliders.

- Removed unused components and packages; fonts are self-hosted.

## Next
1. Planet globe with real site pins, adapted from the GetLayers scene: smaller textures, one bloom pass at most, capped pixel ratio, assets on Vercel Blob. Keep it only if it runs well on a real phone.
2. Mobile performance. A local Lighthouse run before the cleanup gave 55, 63 and 71, with the globe script blocking the main thread for seconds. Load a static globe image first and start three.js afterwards. Decide this together with step 1, then measure with PageSpeed Insights after a production deploy.
3. Photos and immersive view: see `PHOTO_EXPERIENCE.md`.
4. Close the source gaps listed in `DATA_AUDIT.md`, starting with altitude and area.
5. Rendered 3D models of a few well-documented pyramids, drawn from sourced measurements.
6. Add civilization filters once the data has a structured civilization field.
