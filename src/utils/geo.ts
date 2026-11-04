export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Unit vector for a real-world position, in the planet model's frame.
 * The model is rotated 90° around its axis relative to true longitude, measured by matching
 * its land and sea against a reference map (best fit, within 0.5° on every continent).
 */
export function latLonToUnit(lat: number, lon: number): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  return {
    x: -Math.cos(phi) * Math.sin(lambda),
    y: Math.sin(phi),
    z: -Math.cos(phi) * Math.cos(lambda),
  };
}
