/**
 * Partner matching for the prototype marketplace.
 *
 * The platform is a marketplace, not a dispatcher: we only surface partners
 * who can genuinely do the job. Every partner is checked against the request
 * on six dimensions, then the survivors are scored so the best fit appears
 * first. Partners who fail are returned with human-readable reasons so the UI
 * can explain *why* the list is short (intelligent matching, not a bug).
 *
 * Dimensions checked:
 *   1. Availability      — only partners currently online & free
 *   2. Vehicle capacity  — vehicle class must accept the package size
 *   3. Weight limit      — vehicle must carry the stated weight
 *   4. Distance          — within the vehicle's practical range
 *   5. Service area      — partner must cover BOTH pickup and drop-off zones
 *   6. Package needs     — capabilities must cover item type & fragile flag
 */

import { PARTNERS, PARTNER_STATUS } from '../data/partners';
import { vehicleById } from '../data/vehicles';
import { zoneById, zoneName } from '../data/locations';
import { roadDistanceKm } from './geo';
import { computeQuote } from './pricing';
import { itemTypeById } from '../data/packages';

/** Derive a matching-ready request object from the delivery draft. */
export function buildRequest(draft) {
  const pickupZone = zoneById(draft.pickup.zoneId);
  const dropoffZone = zoneById(draft.dropoff.zoneId);
  return {
    pickupZone,
    dropoffZone,
    distanceKm: roadDistanceKm(pickupZone, dropoffZone),
    sizeId: draft.package.size,
    weightKg: Number(draft.package.weightKg) || 0,
    itemType: draft.itemType,
    fragile: !!draft.package.fragile,
    scheduleMode: draft.schedule.mode,
  };
}

const CAPABILITY_FOR_ITEM = {
  documents: 'documents',
  parcel: 'parcels',
  food: 'food',
  electronics: 'electronics',
  clothing: 'clothing',
  other: 'parcels',
};

function coversZone(partner, zoneId) {
  return partner.serviceZones === 'all' || partner.serviceZones.includes(zoneId);
}

/** Returns the list of reasons a partner cannot take this request (empty = eligible). */
export function exclusionReasons(partner, request) {
  const reasons = [];
  const vehicle = vehicleById(partner.vehicle);

  if (partner.status === PARTNER_STATUS.busy) reasons.push('Busy on another delivery right now');
  if (partner.status === PARTNER_STATUS.offline) reasons.push('Currently offline');

  if (vehicle && !vehicle.capacity.includes(request.sizeId)) {
    // Large vehicles decline tiny loads (not economical), small vehicles
    // decline loads they physically cannot carry — worded accordingly.
    const oversized = ['van', 'tricycle'].includes(vehicle.id) && request.sizeId === 'document';
    reasons.push(
      oversized
        ? `${vehicle.label} takes bigger loads, not single documents`
        : `${vehicle.label} is too small for this package`,
    );
  }
  if (vehicle && request.weightKg > vehicle.maxWeightKg) {
    reasons.push(`Over the ${vehicle.maxWeightKg} kg limit for a ${vehicle.label.toLowerCase()}`);
  }
  if (vehicle && request.distanceKm > vehicle.maxKm) {
    reasons.push(`Does not travel ${request.distanceKm.toFixed(1)} km on a ${vehicle.label.toLowerCase()}`);
  }

  if (!coversZone(partner, request.pickupZone?.id)) {
    reasons.push(`Does not pick up in ${zoneName(request.pickupZone?.id)}`);
  } else if (!coversZone(partner, request.dropoffZone?.id)) {
    reasons.push(`Does not deliver to ${zoneName(request.dropoffZone?.id)}`);
  }

  const needed = CAPABILITY_FOR_ITEM[request.itemType] || 'parcels';
  if (!partner.capabilities.includes(needed)) {
    reasons.push(`Does not carry ${itemTypeById(request.itemType).label.toLowerCase()}`);
  }
  if (request.fragile && !partner.capabilities.includes('fragile')) {
    reasons.push('Not equipped for fragile items');
  }

  return reasons;
}

const norm = (v, min, max) => (max === min ? 1 : (v - min) / (max - min));
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** 0–100 fit score across rating, experience, price and speed. */
function scorePartner(partner, quote, stats) {
  const ratingScore = clamp01(norm(partner.rating, 4.0, 5.0));
  const experienceScore = clamp01(norm(partner.deliveries, 0, 400));
  const priceScore = clamp01(1 - norm(quote.price, stats.minPrice, stats.maxPrice));
  const speedScore = clamp01(1 - norm(quote.etaMid, stats.minEta, stats.maxEta));
  const raw =
    0.4 * ratingScore + 0.2 * experienceScore + 0.22 * priceScore + 0.18 * speedScore;
  return Math.round(62 + raw * 38); // present as 62–100 so nothing looks "bad"
}

/**
 * @returns {{matched: Array<{partner, quote, score}>, excluded: Array<{partner, reasons}>, request: object}}
 */
export function matchPartners(draft) {
  const request = buildRequest(draft);

  const eligible = [];
  const excluded = [];

  for (const partner of PARTNERS) {
    const reasons = exclusionReasons(partner, request);
    if (reasons.length > 0) {
      excluded.push({ partner, reasons });
      continue;
    }
    const quote = computeQuote({
      vehicleId: partner.vehicle,
      distanceKm: request.distanceKm,
      sizeId: request.sizeId,
      itemType: request.itemType,
      fragile: request.fragile,
      scheduleMode: request.scheduleMode,
      priceFactor: partner.priceFactor,
    });
    eligible.push({ partner, quote });
  }

  const prices = eligible.map((e) => e.quote.price);
  const etas = eligible.map((e) => e.quote.etaMid);
  const stats = {
    minPrice: Math.min(...prices, 0),
    maxPrice: Math.max(...prices, 0),
    minEta: Math.min(...etas, 0),
    maxEta: Math.max(...etas, 0),
  };

  const matched = eligible
    .map((e) => ({ ...e, score: scorePartner(e.partner, e.quote, stats) }))
    .sort((a, b) => b.score - a.score || a.quote.price - b.quote.price)
    .slice(0, 5); // never overwhelm: at most five suitable partners

  return { matched, excluded, request };
}

export function matchLabel(score) {
  if (score >= 92) return 'Best match';
  if (score >= 84) return 'Great match';
  return 'Good match';
}
