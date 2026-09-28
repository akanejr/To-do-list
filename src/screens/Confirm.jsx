import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';
import RatingBadge from '../components/ui/RatingBadge';
import RouteLines from '../components/delivery/RouteLines';
import SummaryList from '../components/delivery/SummaryList';
import { useStore } from '../state/store';
import { partnerById } from '../data/partners';
import { vehicleById } from '../data/vehicles';
import { sizeById, itemTypeById } from '../data/packages';
import { buildRequest } from '../lib/matching';
import { computeQuote } from '../lib/pricing';
import { naira, etaRange, scheduleDateLabel, scheduleTimeLabel } from '../lib/format';

/** Final review + the mock booking transition. No real payment in Phase 1. */
export default function Confirm() {
  const navigate = useNavigate();
  const { draft, selectedPartnerId, createBooking, resetDraft } = useStore();
  const [submitting, setSubmitting] = useState(false);

  const partner = partnerById(selectedPartnerId);
  const ready = Boolean(partner && draft.pickup.zoneId && draft.dropoff.zoneId);

  useEffect(() => {
    if (!ready) navigate('/partners', { replace: true });
  }, [ready, navigate]);

  const { request, quote } = useMemo(() => {
    if (!ready) return { request: null, quote: null };
    const req = buildRequest(draft);
    return {
      request: req,
      quote: computeQuote({
        vehicleId: partner.vehicle,
        distanceKm: req.distanceKm,
        sizeId: req.sizeId,
        itemType: req.itemType,
        fragile: req.fragile,
        scheduleMode: req.scheduleMode,
        priceFactor: partner.priceFactor,
      }),
    };
  }, [ready, draft, partner]);

  if (!ready) return null;

  const vehicle = vehicleById(partner.vehicle);
  const size = sizeById(draft.package.size);

  const confirm = () => {
    setSubmitting(true);
    // Simulated network round-trip so the state change feels real.
    setTimeout(() => {
      const booking = createBooking({ draft, partnerId: partner.id, quote, request });
      resetDraft();
      navigate(`/created/${booking.id}`, { replace: true });
    }, 900);
  };

  return (
    <Screen
      onBack={() => navigate('/partners')}
      title="Confirm delivery"
      subtitle="One last look before we send it"
      footer={
        <>
          <Button block size="lg" loading={submitting} icon={submitting ? undefined : 'check'} onClick={confirm}>
            {submitting ? 'Booking your partner…' : 'Confirm delivery'}
          </Button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-400)' }}>
            No payment now — you pay {naira(quote.price)} when it's delivered
          </p>
        </>
      }
    >
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <Avatar src={partner.photo} name={partner.name} size={48} verified={partner.verified} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pcard__namerow">
            <h3 style={{ fontSize: 15.5 }}>{partner.name}</h3>
          </div>
          <div className="pcard__meta">
            <RatingBadge value={partner.rating} />
            <span className="pcard__dot" aria-hidden="true" />
            <span>
              {vehicle.emoji} {vehicle.label}
            </span>
          </div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={() => navigate('/partners')}>
          Change
        </button>
      </div>

      <div className="card">
        <RouteLines
          pickup={{
            zoneId: draft.pickup.zoneId,
            line: draft.pickup.line1,
            contact: `${draft.pickup.contactName} · ${draft.pickup.contactPhone}`,
          }}
          dropoff={{
            zoneId: draft.dropoff.zoneId,
            line: draft.dropoff.line1,
            contact: `${draft.dropoff.recipientName} · ${draft.dropoff.recipientPhone}`,
          }}
        />
      </div>

      <div className="card">
        <SummaryList
          rows={[
            { label: 'Package', value: `${size.label} · ${itemTypeById(draft.itemType).label}` },
            { label: 'Weight', value: `${draft.package.weightKg} kg`, num: true },
            { label: 'Handling', value: draft.package.fragile ? 'Fragile' : 'Standard' },
            {
              label: 'Pickup',
              value:
                draft.schedule.mode === 'asap'
                  ? 'As soon as possible'
                  : `${scheduleDateLabel(draft.schedule.date)}, ${scheduleTimeLabel(draft.schedule.time)}`,
            },
            { label: 'Estimated delivery', value: etaRange(quote.etaRange), num: true },
          ]}
        />
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <span className="eyebrow">Delivery fee</span>
        <SummaryList
          rows={quote.breakdown.map((b) => ({ label: b.label, value: naira(b.amount), num: true }))}
        />
        <div className="total">
          <span className="total__label">Total amount</span>
          <span className="total__value num">{naira(quote.price)}</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-400)' }}>
          <Icon name="shield" size={13} />
          Partners are verified. Pay only when your package arrives.
        </span>
      </div>
    </Screen>
  );
}
