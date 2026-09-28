/**
 * Tiny geo helpers. Haversine over mock zone coordinates gives believable
 * straight-line distances; a city factor approximates real road distance.
 */

const R = 6371; // earth radius, km
const ROAD_FACTOR = 1.32; // straight line -> road distance

const toRad = (deg) => (deg * Math.PI) / 180;

export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Road-approximate distance in km between two zones, rounded to 0.1 km. */
export function roadDistanceKm(zoneA, zoneB) {
  if (!zoneA || !zoneB) return 0;
  if (zoneA.id === zoneB.id) return 1.2; // same area, short hop
  return Math.round(haversineKm(zoneA, zoneB) * ROAD_FACTOR * 10) / 10;
}
