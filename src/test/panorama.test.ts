import { describe, expect, it } from 'vitest';
import pyramids from '@/data/pyramids.json';
import panoramas from '@/data/sitePanoramas.json';
import { clampFov, maxFov, maxPitch, startFov, stripHalfHeight, wrapU } from '@/utils/panorama';

describe('panorama data', () => {
  const ids = new Set(pyramids.map((p) => p.id));
  it.each(Object.entries(panoramas))('%s points at a real site with a valid entry', (id, entry) => {
    expect(ids.has(id)).toBe(true);
    expect(['sphere', 'strip']).toContain(entry.kind);
    expect(entry.start).toBeGreaterThanOrEqual(0);
    expect(entry.start).toBeLessThan(1);
  });
});

describe('panorama limits', () => {
  const half = stripHalfHeight(14500, 2500);

  it('never shows past the top or bottom of a strip', () => {
    for (const fov of [25, 40, startFov('strip', half)]) {
      const edge = maxPitch('strip', half, fov) + fov / 2;
      expect(Math.tan((edge * Math.PI) / 180)).toBeLessThanOrEqual(half + 1e-9);
    }
  });

  it('keeps the zoom in range', () => {
    expect(clampFov(500, 'strip', half)).toBe(maxFov('strip', half));
    expect(clampFov(1, 'sphere', 0)).toBe(25);
  });

  it('wraps the horizontal position', () => {
    expect(wrapU(1.25)).toBeCloseTo(0.25);
    expect(wrapU(-0.25)).toBeCloseTo(0.75);
  });
});
