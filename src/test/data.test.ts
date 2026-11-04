import { describe, it, expect } from "vitest";
import data from "@/data/pyramids.json";
import { Pyramid } from "@/types/pyramid";
import auditText from "../../docs/DATA_AUDIT.md?raw";

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

describe("data audit report", () => {
  it("matches the dataset (run bun run audit to refresh it)", () => {
    const lines = auditText.split("\n");
    for (const p of all) {
      const at = lines.findIndex((l) => l.startsWith("### `" + p.id + "`"));
      expect(at, p.id).toBeGreaterThan(-1);
      const gaps = p.campi_senza_fonte ?? [];
      const next = lines[at + 1] ?? "";
      if (gaps.length) expect(next, p.id).toBe("- No source for: " + gaps.join(", "));
      else expect(next.startsWith("- No source for:"), p.id).toBe(false);
    }
    const total = all.reduce((n, p) => n + (p.campi_senza_fonte?.length ?? 0), 0);
    expect(auditText).toContain(`Unsourced fields in total: ${total}.`);
  });
});
