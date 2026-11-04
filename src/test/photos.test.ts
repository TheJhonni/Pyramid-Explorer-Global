import { describe, it, expect } from "vitest";
import photos from "@/data/sitePhotos.json";
import data from "@/data/pyramids.json";
import { parseCommonsResponse } from "@/utils/commonsPhotos";

describe("site photos", () => {
  it("only lists known sites, at most five files each", () => {
    const ids = new Set((data as { id: string }[]).map((p) => p.id));
    for (const [id, files] of Object.entries(photos)) {
      expect(ids.has(id)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
      expect(files.length).toBeLessThanOrEqual(5);
    }
  });
});

describe("parseCommonsResponse", () => {
  const info = (license?: string) => [{
    thumburl: "https://x/a.jpg",
    thumbwidth: 1280,
    thumbheight: 800,
    descriptionurl: "https://commons/a",
    extmetadata: { Artist: { value: '<a href="#">Jane <b>Doe</b></a>' }, LicenseShortName: license ? { value: license } : {} },
  }];

  it("keeps the requested order, follows normalized titles and strips markup", () => {
    const result = parseCommonsResponse(
      {
        query: {
          normalized: [{ from: "File:a_b.jpg", to: "File:A b.jpg" }],
          pages: { 1: { title: "File:C.jpg", imageinfo: info("CC0") }, 2: { title: "File:A b.jpg", imageinfo: info("CC BY 4.0") } },
        },
      },
      ["a_b.jpg", "C.jpg"],
    );
    expect(result.map((p) => p.license)).toEqual(["CC BY 4.0", "CC0"]);
    expect(result[0].author).toBe("Jane Doe");
  });

  it("drops files without a licence", () => {
    const result = parseCommonsResponse({ query: { pages: { 1: { title: "File:A.jpg", imageinfo: info() } } } }, ["A.jpg"]);
    expect(result).toEqual([]);
  });
});
