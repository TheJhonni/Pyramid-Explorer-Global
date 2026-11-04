import { describe, it, expect } from "vitest";
import data from "@/data/pyramids.json";
import { Pyramid } from "@/types/pyramid";

const all = data as Pyramid[];
const locales = import.meta.glob<Record<string, Partial<Pyramid>>>("../data/locales/*.json", { eager: true, import: "default" });

describe("dataset", () => {
  it("has unique ids", () => {
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
  });

  it("gives every verified site a source and a valid status", () => {
    for (const p of all) {
      expect(["verified", "partial", "unverified"]).toContain(p.stato_verifica);
      if (p.stato_verifica === "verified") expect(p.fonti?.length).toBeGreaterThan(0);
    }
  });

  it("keeps date ranges in order", () => {
    for (const p of all) {
      if (typeof p.anno_inizio === "number" && typeof p.anno_fine === "number") {
        expect(p.anno_inizio).toBeLessThanOrEqual(p.anno_fine);
      }
    }
  });

  it("has every site translated in every language", () => {
    expect(Object.keys(locales)).toHaveLength(5);
    for (const overlay of Object.values(locales)) {
      expect(Object.keys(overlay).sort()).toEqual(all.map((p) => p.id).sort());
    }
  });
});
