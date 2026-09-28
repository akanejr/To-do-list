/**
 * Mock fare + ETA engine.
 *
 * Everything here is deterministic and transparent so the prototype feels
 * trustworthy: base fare + per-km rate, scaled by package size, with small
 * surcharges for fragile handling, insulated food boxes and ASAP dispatch.
 * Swap for a real pricing service in Phase 2+.
 */

import { VEHICLES } from '../data/vehicles';
import { sizeById } from '../data/packages';

const roundTo50 = (n) => Math.round(n / 50) * 50;
const roundTo5 = (n) => Math.round(n / 5) * 5;

/** Cheapest sensible vehicle class for a size — used for the headline estimate. */
export function referenceVehicleForSize(sizeId) {
  return sizeId === 'large' ? 'car' : 'motorcycle';
}

const SURCHARGES = {
  fragile: 250,
  food: 150, // insulated box
  asap: 200, // priority dispatch
};

/**
 * @param {object} args
 * @param {string} args.vehicleId
 * @param {number} args.distanceKm
 * @param {string} args.sizeId
 * @param {string} [args.itemType]
 * @param {boolean} [args.fragile]
 * @param {string} [args.scheduleMode] 'asap' | 'scheduled'
 * @param {number} [args.priceFactor] partner-specific multiplier
 * @returns {{price:number, etaRange:[number,number], etaMid:number, breakdown:Array}}
 */
export function computeQuote({
  vehicleId,
  distanceKm,
  sizeId,
  itemType = 'parcel',
  fragile = false,
  scheduleMode = 'asap',
  priceFactor = 1,
}) {
  const vehicle = VEHICLES[vehicleId] || VEHICLES.motorcycle;
  const size = sizeById(sizeId);

  const base = vehicle.baseFare + vehicle.perKm * distanceKm;
  const sized = base * size.multiplier;

  const extras = [];
  let extra = 0;
  if (fragile) {
    extra += SURCHARGES.fragile;
    extras.push({ label: 'Fragile handling', amount: SURCHARGES.fragile });
  }
  if (itemType === 'food') {
    extra += SURCHARGES.food;
    extras.push({ label: 'Insulated food box', amount: SURCHARGES.food });
  }
  if (scheduleMode === 'asap') {
    extra += SURCHARGES.asap;
    extras.push({ label: 'Priority dispatch', amount: SURCHARGES.asap });
  }

  const raw = (sized + extra) * priceFactor;
  const price = roundTo50(raw);

  const travelMin = (distanceKm / vehicle.speedKmh) * 60;
  const etaMid = vehicle.dispatchMin + travelMin + size.handlingMin;
  const lo = Math.max(10, roundTo5(etaMid * 0.92));
  const hi = Math.max(lo + 5, roundTo5(etaMid * 1.24));

  return {
    price,
    etaRange: [lo, hi],
    etaMid: Math.round(etaMid),
    breakdown: [
      { label: `${vehicle.label} base fare`, amount: vehicle.baseFare },
      { label: `Distance (${distanceKm.toFixed(1)} km)`, amount: Math.round(vehicle.perKm * distanceKm) },
      { label: `${size.label} handling`, amount: Math.round(base * (size.multiplier - 1)) },
      ...extras,
    ],
  };
}

/** Headline estimate shown before partner selection. */
export function platformEstimate(request) {
  return computeQuote({
    vehicleId: referenceVehicleForSize(request.sizeId),
    distanceKm: request.distanceKm,
    sizeId: request.sizeId,
    itemType: request.itemType,
    fragile: request.fragile,
    scheduleMode: request.scheduleMode,
    priceFactor: 1,
  });
}
