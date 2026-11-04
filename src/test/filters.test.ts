import { describe, it, expect } from "vitest";
import pyramidsData from "@/data/pyramids.json";
import { Pyramid, defaultFilters } from "@/types/pyramid";
import { filterPyramids } from "@/utils/filters";
import { civilizationKeys, civilizationLabel } from "@/i18n/civilizations";

const all = pyramidsData as Pyramid[];

describe("filterPyramids", () => {
  it("returns every pyramid with the default filters", () => {
    expect(filterPyramids(all, defaultFilters)).toHaveLength(all.length);
  });

  it("filters by continent and by free text", () => {
    const africa = filterPyramids(all, { ...defaultFilters, continente: "Africa" });
    expect(africa.length).toBeGreaterThan(0);
    expect(africa.every((p) => p.continente === "Africa")).toBe(true);

    const giza = filterPyramids(all, { ...defaultFilters, searchText: "giza" });
    expect(giza.length).toBeGreaterThan(0);
  });

  it("filters by civilization and leaves unclear builders out", () => {
    const maya = filterPyramids(all, { ...defaultFilters, civilization: "maya" });
    expect(maya.length).toBeGreaterThan(5);
    expect(maya.every((p) => p.civilta === "maya")).toBe(true);
    expect(all.find((p) => p.id === "cholula")?.civilta).toBeNull();
  });

  it("gives every civilization key a label in every language", () => {
    for (const p of all) if (p.civilta) expect(civilizationKeys).toContain(p.civilta);
    for (const key of civilizationKeys) {
      for (const lang of ["en", "it", "es", "fr", "de", "pt"] as const) expect(civilizationLabel(key, lang)).toBeTruthy();
      expect(all.some((p) => p.civilta === key)).toBe(true);
    }
  });

  it("every pyramid has valid coordinates", () => {
    for (const p of all) {
      expect(Math.abs(p.coordinate.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(p.coordinate.lon)).toBeLessThanOrEqual(180);
    }
  });
});
