import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import RouteLines from '../components/delivery/RouteLines';
import SummaryList from '../components/delivery/SummaryList';
import { useStore } from '../state/store';
import { matchPartners } from '../lib/matching';
import { platformEstimate } from '../lib/pricing';
import { naira, km, etaRange, scheduleDateLabel, scheduleTimeLabel } from '../lib/format';
import { sizeById, itemTypeById } from '../data/packages';

/** Clean summary of the request + headline estimate, before partner choice. */
export default function Estimate() {
  const navigate = useNavigate();
  const { draft } = useStore();

  const ready = Boolean(draft.pickup.zoneId && draft.dropoff.zoneId && draft.pickup.line1);
  useEffect(() => {
    if (!ready) navigate('/send', { replace: true });
  }, [ready, navigate]);

  const { request, matched } = useMemo(() => matchPartners(draft), [draft]);
  const estimate = useMemo(() => platformEstimate(request), [request]);

  if (!ready) return null;

  const size = sizeById(draft.package.size);
  const item = itemTypeById(draft.itemType);

  return (
    <Screen
      onBack={() => navigate('/send')}
      title="Delivery estimate"
      subtitle="Review before we find your partner"
      footer={
        <>
          <Button block size="lg" icon="sparkle" onClick={() => navigate('/partners')}>
            Find delivery partners
          </Button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-400)' }}>
            Final price is confirmed once you choose a partner
          </p>
        </>
      }
    >
      <div className="estimate__hero">
        <RouteLines
          pickup={{ zoneId: draft.pickup.zoneId, line: draft.pickup.line1 }}
          dropoff={{ zoneId: draft.dropoff.zoneId, line: draft.dropoff.line1 }}
        />
        <div className="estimate__price">
          <div>
            <span className="estimate__pricelabel">Estimated price</span>
            <div className="estimate__pricevalue num">{naira(estimate.price)}</div>
          </div>
          <span className="estimate__eta num">
            <Icon name="clock" size={14} />
            {etaRange(estimate.etaRange)}
          </span>
        </div>
      </div>

      <div className="statsrow">
        <div className="stat">
          <span className="stat__label">
            <Icon name="route" size={13} /> Distance
          </span>
          <span className="stat__value num">{km(request.distanceKm)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">
            <Icon name="clock" size={13} /> Delivery
          </span>
          <span className="stat__value num">{etaRange(estimate.etaRange)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">
            <Icon name="box" size={13} /> Package
          </span>
          <span className="stat__value">{size.label}</span>
        </div>
        <div className="stat">
          <span className="stat__label">
            <Icon name={draft.schedule.mode === 'asap' ? 'bolt' : 'calendar'} size={13} /> Pickup
          </span>
          <span className="stat__value">
            {draft.schedule.mode === 'asap'
              ? 'ASAP'
              : `${scheduleDateLabel(draft.schedule.date)} · ${scheduleTimeLabel(draft.schedule.time)}`}
          </span>
        </div>
      </div>

      <div className="card">
        <SummaryList
          rows={[
            { label: 'Package', value: `${size.label} · ${item.label}` },
            { label: 'Weight', value: `${draft.package.weightKg} kg`, num: true },
            { label: 'Handling', value: draft.package.fragile ? 'Fragile — handle with care' : 'Standard' },
            ...(draft.package.description ? [{ label: 'Description', value: draft.package.description }] : []),
            {
              label: 'Partners available',
              value: `${matched.length} nearby & suitable`,
              emphasis: true,
            },
          ]}
        />
      </div>
    </Screen>
  );
}
