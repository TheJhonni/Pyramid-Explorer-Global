import { describe, it, expect } from "vitest";
import { latLonToUnit } from "@/utils/geo";

describe("latLonToUnit", () => {
  it("puts the poles on the axis", () => {
    expect(latLonToUnit(90, 0).y).toBeCloseTo(1);
    expect(latLonToUnit(-90, 45).y).toBeCloseTo(-1);
  });

  it("applies the model's rotation", () => {
    const zero = latLonToUnit(0, 0);
    expect(zero.z).toBeCloseTo(-1);
    const east = latLonToUnit(0, 90);
    expect(east.x).toBeCloseTo(-1);
  });

  it("returns unit vectors", () => {
    const v = latLonToUnit(29.98, 31.13);
    expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1);
  });
});
