/** One horizontal section of a schematic model: width (x), depth (z) and height (y), in metres. */
export type Section = [width: number, depth: number, y: number];

export interface SiteModel {
  sections: Section[];
  sources: { title: string; url: string }[];
}

/**
 * Triangles for the sides and the base of a stack of frustums, centred on the origin.
 * Returns flat x, y, z triples, three vertices per triangle, faces wound outwards.
 */
export function buildModelPositions(sections: Section[]): number[] {
  if (sections.length < 2) throw new Error('A model needs at least two sections');
  const corners = ([w, d, y]: Section) => [
    [-w / 2, y, d / 2],
    [w / 2, y, d / 2],
    [w / 2, y, -d / 2],
    [-w / 2, y, -d / 2],
  ];
  const out: number[] = [];
  const tri = (a: number[], b: number[], c: number[]) => out.push(...a, ...b, ...c);
  for (let s = 0; s < sections.length - 1; s++) {
    const lo = corners(sections[s]);
    const hi = corners(sections[s + 1]);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      tri(lo[i], lo[j], hi[j]);
      if (sections[s + 1][0] > 0 || sections[s + 1][1] > 0) tri(lo[i], hi[j], hi[i]);
    }
  }
  const base = corners(sections[0]);
  tri(base[0], base[2], base[1]);
  tri(base[0], base[3], base[2]);
  return out;
}

export const modelHeight = (sections: Section[]) => sections[sections.length - 1][2];
export const modelSpan = (sections: Section[]) => Math.max(...sections.map(([w, d]) => Math.max(w, d)));
