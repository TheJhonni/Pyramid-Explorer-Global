# Roadmap

## Done

### First release (PR #1 to #4)
- Renamed to Pyramid Explorer; neutral labels for mainstream data and alternative claims.
- Fact-checked dataset of 103 sites with status, sources and flagged gaps.
- Site texts in six languages, with language detection and memory.
- Shareable URLs for sites, filters and comparisons; prerendered site pages and a sitemap.
- Scale comparison, timeline, guided tour, period and verification filters, sorting.
- Planet globe with real site pins; a static picture paints first and the 3D scene starts afterwards.
- Photo gallery from Commons with author and licence on every photo.
- 360° view, first trial on Commons panoramas.

### Final polish (PR #5)
- Coordinates of every site checked against Wikipedia, Wikidata and OpenStreetMap; the Pyramid of the Moon and Marae Mahaiatea were moved to their real positions.
- Khufu confirmed in the Giza panorama from the author's own note on Commons.
- 19 altitude and area gaps filled from sources; a coverage report in `DATA_AUDIT.md` is generated from the data, and a test fails when it is stale.
- Photos for 10 more sites (93 of 103).
- A second Commons search for 360° panoramas on all 99 uncovered sites found no new file that shows one of them (see `PHOTO_EXPERIENCE.md`).
- Civilization filter, from the builders already named in the data.
- Schematic 3D models of five Egyptian pyramids, built only from sourced measurements and loaded on demand.
- Brighter globe on phones, at the same cost per pixel.
- Keyboard, focus and screen reader fixes in the gallery and the 360° viewer; Escape in a dialog no longer closes the site card.
- Translated 404 page, globe and map labels; localized numbers in the comparison.

## Next
1. Close the remaining source gaps in `DATA_AUDIT.md`: 76 altitudes and 71 areas are still unsourced. Open sources rarely give a site's altitude; an archaeological or survey source is needed, not a terrain model.
2. Sites still without photos: the claimed Visoko hills, Kola, Crimea, the Azores, Gunung Lalakon, Icod de los Vinos, Gympie, Pulemelei. Most have no free image of the structure itself.
3. More 360° coverage needs either new Commons uploads or a decision on Street View or Mapillary, which need an API key.
4. A human review of the data check, entry by entry: so far it was done by agents against the sources.
5. Keep measuring with Lighthouse and PageSpeed after each deploy.
