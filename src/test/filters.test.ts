import { describe, it, expect } from "vitest";
import pyramidsData from "@/data/pyramids.json";
import { Pyramid, defaultFilters } from "@/types/pyramid";
import { filterPyramids } from "@/utils/filters";

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

  it("every pyramid has valid coordinates", () => {
    for (const p of all) {
      expect(Math.abs(p.coordinate.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(p.coordinate.lon)).toBeLessThanOrEqual(180);
    }
  });
});
