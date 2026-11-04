export type PanoramaKind = 'sphere' | 'strip';

export interface SitePanorama {
  file: string;
  kind: PanoramaKind;
  /** Horizontal position of the image, from 0 to 1, shown first. */
  start: number;
}

const DEG = Math.PI / 180;
const MIN_FOV = 25;
const SPHERE_FOV = 75;
const SPHERE_MAX_FOV = 95;
const SPHERE_MAX_PITCH = 85;

/** Half the height of a 360° strip wrapped around a cylinder of radius 1. */
export const stripHalfHeight = (width: number, height: number) => (Math.PI * height) / width;

/** Widest vertical field of view that stays inside the image. */
export function maxFov(kind: PanoramaKind, halfHeight: number) {
  if (kind === 'sphere') return SPHERE_MAX_FOV;
  return (2 * Math.atan(halfHeight)) / DEG - 1;
}

export const startFov = (kind: PanoramaKind, halfHeight: number) =>
  kind === 'sphere' ? SPHERE_FOV : maxFov(kind, halfHeight);

export const clampFov = (fov: number, kind: PanoramaKind, halfHeight: number) =>
  Math.min(maxFov(kind, halfHeight), Math.max(MIN_FOV, fov));

/** How far up or down, in degrees, the view can tilt without showing past the image. */
export function maxPitch(kind: PanoramaKind, halfHeight: number, fov: number) {
  if (kind === 'sphere') return SPHERE_MAX_PITCH;
  return Math.max(0, Math.atan(halfHeight) / DEG - fov / 2);
}

export const wrapU = (u: number) => u - Math.floor(u);

/** Unit horizontal direction of image position u, matching the meshes in PanoramaViewer. */
export function directionOf(kind: PanoramaKind, u: number): [number, number] {
  const a = u * 2 * Math.PI;
  return kind === 'sphere' ? [Math.cos(a), Math.sin(a)] : [-Math.sin(a), Math.cos(a)];
}
