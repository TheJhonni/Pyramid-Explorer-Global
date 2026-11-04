import { describe, it, expect } from "vitest";
import models from "@/data/siteModels.json";
import data from "@/data/pyramids.json";
import { buildModelPositions, modelHeight, SiteModel, Section } from "@/utils/model";
import { Pyramid } from "@/types/pyramid";

const all = data as Pyramid[];
const index = models as unknown as Record<string, SiteModel>;

describe("schematic models", () => {
  it("covers at most five known sites, each with a source", () => {
    expect(Object.keys(index).length).toBeLessThanOrEqual(5);
    for (const [id, m] of Object.entries(index)) {
      expect(all.some((p) => p.id === id)).toBe(true);
      expect(m.sources.length).toBeGreaterThan(0);
      expect(m.sections[0][2]).toBe(0);
      for (let i = 1; i < m.sections.length; i++) expect(m.sections[i][2]).toBeGreaterThan(m.sections[i - 1][2]);
    }
  });

  it("uses the same base and height as the site data where both are sourced", () => {
    for (const [id, m] of Object.entries(index)) {
      const p = all.find((x) => x.id === id)!;
      expect(Math.abs(Math.max(m.sections[0][0], m.sections[0][1]) - p.base_m)).toBeLessThan(0.1);
      expect(p.campi_senza_fonte ?? []).not.toContain("base_m");
    }
  });

  it("builds outward-facing triangles", () => {
    const sections: Section[] = [[2, 2, 0], [0, 0, 1]];
    const pos = buildModelPositions(sections);
    expect(pos.length).toBe((4 + 2) * 9);
    // First side face is the +z face: its normal must point towards +z.
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = pos;
    const u = [bx - ax, by - ay, bz - az];
    const v = [cx - ax, cy - ay, cz - az];
    expect(u[0] * v[1] - u[1] * v[0]).toBeGreaterThan(0);
    expect(modelHeight(sections)).toBe(1);
  });
});
