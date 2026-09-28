import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Sheet from '../components/ui/Sheet';
import Avatar from '../components/ui/Avatar';
import PartnerCard from '../components/delivery/PartnerCard';
import { useStore } from '../state/store';
import { matchPartners } from '../lib/matching';
import { zoneName } from '../data/locations';
import { km } from '../lib/format';

/**
 * The marketplace moment: only partners who can genuinely do this job are
 * shown, best fit first. Excluded partners are explainable, never hidden
 * silently — that's what makes the matching feel intelligent and honest.
 */
export default function Partners() {
  const navigate = useNavigate();
  const { draft, setSelectedPartnerId } = useStore();
  const [whyOpen, setWhyOpen] = useState(false);

  const ready = Boolean(draft.pickup.zoneId && draft.dropoff.zoneId);
  useEffect(() => {
    if (!ready) navigate('/send', { replace: true });
  }, [ready, navigate]);

  const { matched, excluded, request } = useMemo(() => matchPartners(draft), [draft]);

  if (!ready) return null;

  const select = (partnerId) => {
    setSelectedPartnerId(partnerId);
    navigate('/confirm');
  };

  return (
    <Screen
      onBack={() => navigate('/estimate')}
      title="Available partners"
      subtitle={`${zoneName(request.pickupZone.id)} → ${zoneName(request.dropoffZone.id)} · ${km(request.distanceKm)}`}
    >
      <div className="matchnote">
        <span className="matchnote__icon">
          <Icon name="shield" size={16} />
        </span>
        <span className="matchnote__text">
          <b>{matched.length} partners</b> are free right now and matched to your{' '}
          {request.fragile ? 'fragile ' : ''}
          {request.sizeId} trip.{' '}
          {excluded.length > 0 ? (
            <button className="matchnote__link" onClick={() => setWhyOpen(true)}>
              Why not all {matched.length + excluded.length}? <Icon name="chevronRight" size={13} />
            </button>
          ) : null}
        </span>
      </div>

      {matched.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-6) var(--sp-4)' }}>
          <span style={{ fontSize: 34 }}>🛵</span>
          <h3 style={{ marginTop: 'var(--sp-3)', fontSize: 17 }}>No partner fits this request yet</h3>
          <p style={{ color: 'var(--ink-500)', fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}>
            Try a smaller package size, remove the fragile option, or pick a different pickup time —
            partners free up every few minutes.
          </p>
          <Button
            variant="secondary"
            size="md"
            style={{ marginTop: 'var(--sp-4)' }}
            onClick={() => navigate('/send')}
          >
            Edit my request
          </Button>
        </div>
      ) : (
        matched.map((entry) => (
          <PartnerCard
            key={entry.partner.id}
            entry={entry}
            onSelect={() => select(entry.partner.id)}
            onViewProfile={() => navigate(`/partners/${entry.partner.id}`)}
          />
        ))
      )}

      <Sheet open={whyOpen} onClose={() => setWhyOpen(false)} title="How we choose partners">
        <p style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55 }}>
          We only show partners who are <b>available now</b>, carry your package size and weight,
          travel this distance, cover both areas, and are equipped for what's inside.
        </p>
        <div className="excluded">
          {excluded.map(({ partner, reasons }) => (
            <div className="excluded__item" key={partner.id}>
              <Avatar src={partner.photo} name={partner.name} size={34} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="excluded__name" style={{ display: 'block' }}>
                  {partner.name}
                </span>
                <span className="excluded__reason">{reasons[0]}</span>
              </span>
            </div>
          ))}
        </div>
      </Sheet>
    </Screen>
  );
}
