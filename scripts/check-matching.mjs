/**
 * Dev-only sanity check for the Phase 1 matching + pricing engine.
 * Run: npx esbuild scripts/check-matching.mjs --bundle --platform=node \
 *        --loader:.jpg=dataurl --format=esm --outfile=/tmp/check.mjs && node /tmp/check.mjs
 */
import { matchPartners } from '../src/lib/matching.js';

const draft = (over = {}) => ({
  itemType: 'parcel',
  pickup: { zoneId: 'rumuola', line1: '14 Rumuola Road', contactName: 'A', contactPhone: '08031234567' },
  dropoff: { zoneId: 'waterlines', line1: '7 Marine Base', recipientName: 'B', recipientPhone: '08031234567' },
  package: { size: 'small', weightKg: 3, description: '', fragile: false },
  schedule: { mode: 'asap', date: '', time: '' },
  ...over,
});

const show = (title, d) => {
  const { matched, excluded, request } = matchPartners(d);
  console.log(`\n=== ${title} ===`);
  console.log(`distance ${request.distanceKm} km | size ${request.sizeId} | item ${request.itemType} | fragile ${request.fragile}`);
  console.log(
    'MATCHED:',
    matched.map((m) => `${m.partner.name}(${m.partner.vehicle} ₦${m.quote.price} eta${m.quote.etaRange[0]}-${m.quote.etaRange[1]} score${m.score})`).join(', ') || 'none',
  );
  console.log(
    'EXCLUDED:',
    excluded.map((e) => `${e.partner.name}[${e.reasons[0]}]`).join(', ') || 'none',
  );
};

show('A. small parcel rumuola→waterlines', draft());
show('B. food small rumuola→waterlines', draft({ itemType: 'food' }));
show('C. large 25kg rumuola→choba', draft({ package: { size: 'large', weightKg: 25 }, dropoff: { zoneId: 'choba', line1: 'x' } }));
show('D. fragile large electronics rumuola→eliozu', draft({ itemType: 'electronics', package: { size: 'large', weightKg: 18, fragile: true }, dropoff: { zoneId: 'eliozu', line1: 'x' } }));
show('E. document gra2→oldgra', draft({ itemType: 'documents', package: { size: 'document', weightKg: 0.5 }, pickup: { zoneId: 'gra2', line1: 'x' }, dropoff: { zoneId: 'oldgra', line1: 'y' } }));
show('F. scheduled small rumuola→waterlines', draft({ schedule: { mode: 'scheduled', date: '2026-09-29', time: '09:00' } }));
show('G. medium 12kg rumuokoro→adageorge', draft({ package: { size: 'medium', weightKg: 12 }, pickup: { zoneId: 'rumuokoro', line1: 'x' }, dropoff: { zoneId: 'adageorge', line1: 'y' } }));
