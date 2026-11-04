import { describe, it, expect } from "vitest";
import { defaultFilters, HEIGHT_LIMIT } from "@/types/pyramid";
import { filtersFromParams, filtersToParams, parseCompare } from "@/utils/urlState";

describe("URL state", () => {
  it("keeps the default URL clean", () => {
    expect(filtersToParams(defaultFilters).toString()).toBe("");
  });

  it("round-trips filters", () => {
    const filters = { ...defaultFilters, searchText: "giza", continente: "Africa", civilization: "egyptian", heightMin: 50, period: "ancient" as const, sort: "height" as const, soloVerificate: true };
    expect(filtersFromParams(filtersToParams(filters))).toEqual(filters);
  });

  it("ignores values it does not recognise", () => {
    const parsed = filtersFromParams(new URLSearchParams("period=nope&sort=nope&hmin=abc&hmax=99999&civ=atlantis"));
    expect(parsed.civilization).toBe("");
    expect(parsed.period).toBe("");
    expect(parsed.sort).toBe("name");
    expect(parsed.heightMin).toBe(0);
    expect(parsed.heightMax).toBe(HEIGHT_LIMIT);
  });

  it("keeps unrelated params such as the comparison", () => {
    const params = filtersToParams({ ...defaultFilters, searchText: "x" }, new URLSearchParams("compare=a,b"));
    expect(params.get("compare")).toBe("a,b");
  });

  it("drops unknown sites from a comparison and caps it at six", () => {
    const known = new Set(["a", "b", "c", "d", "e", "f", "g"]);
    expect(parseCompare("a,zzz,b", known)).toEqual(["a", "b"]);
    expect(parseCompare("a,b,c,d,e,f,g", known)).toHaveLength(6);
    expect(parseCompare(null, known)).toEqual([]);
  });
});
