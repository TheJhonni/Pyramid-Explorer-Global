// Calculate sun position for day/night terminator
export function getSunPosition(): { lat: number; lng: number } {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  
  // Solar declination (simplified)
  const declination = -23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));
  
  // Hour angle based on UTC time
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const lng = (12 - hours) * 15; // 15 degrees per hour
  
  return { lat: declination, lng };
}
