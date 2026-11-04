import { describe, it, expect } from "vitest";
import pyramidsData from "@/data/pyramids.json";
import { Pyramid } from "@/types/pyramid";
import { LOCALIZED_FIELDS, loadLocaleOverlay, localizePyramids } from "@/i18n/pyramidLocale";
import type { Lang } from "@/i18n/I18nContext";

const base = pyramidsData as Pyramid[];
const ids = base.map((p) => p.id);
const langs: Lang[] = ["en", "es", "fr", "de", "pt"];

describe("dataset translations", () => {
  it.each(langs)("%s covers every pyramid and every text field", async (lang) => {
    const overlay = await loadLocaleOverlay(lang);
    expect(Object.keys(overlay).sort()).toEqual([...ids].sort());
    for (const p of base) {
      const o = overlay[p.id];
      for (const field of LOCALIZED_FIELDS) {
        const source = p[field];
        const value = o[field];
        if (Array.isArray(source)) {
          expect(Array.isArray(value), `${lang}/${p.id}/${field}`).toBe(true);
          expect((value as string[]).length, `${lang}/${p.id}/${field}`).toBe(source.length);
        } else if (source) {
          expect(typeof value === "string" && value.length > 0, `${lang}/${p.id}/${field}`).toBe(true);
        }
      }
    }
  });

  it("no translated note is left in Italian", async () => {
    // Cheap guard: common Italian words that should never survive in another language.
    const italian = /\b(della|delle|dello|anni|secolo|piramide|costruita|civiltà)\b/i;
    for (const lang of langs) {
      const overlay = await loadLocaleOverlay(lang);
      for (const id of ids) {
        expect(overlay[id].note ?? "", `${lang}/${id}`).not.toMatch(italian);
      }
    }
  });

  it("localizing keeps numbers, coordinates and links from the base dataset", async () => {
    const de = localizePyramids(base, await loadLocaleOverlay("de"));
    const giza = de.find((p) => p.id === "giza_great")!;
    const src = base.find((p) => p.id === "giza_great")!;
    expect(giza.nome).toBe("Große Pyramide von Gizeh (Cheops)");
    expect(giza.altezza_struttura_m).toBe(src.altezza_struttura_m);
    expect(giza.coordinate).toEqual(src.coordinate);
    expect(giza.link_approfondimento_ufficiale).toEqual(src.link_approfondimento_ufficiale);
  });

  it("ids are unique", () => {
    expect(new Set(ids).size).toBe(ids.length);
  });
});
