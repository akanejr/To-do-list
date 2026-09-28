import { useNavigate, useParams } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';
import RatingBadge from '../components/ui/RatingBadge';
import StatusPill from '../components/ui/StatusPill';
import MapPlaceholder from '../components/delivery/MapPlaceholder';
import StatusTimeline from '../components/delivery/StatusTimeline';
import RouteLines from '../components/delivery/RouteLines';
import { useStore } from '../state/store';
import { partnerById, PARTNER_PHONES } from '../data/partners';
import { vehicleById } from '../data/vehicles';
import { TRACKING_STEPS, DELIVERY_STATUS } from '../data/deliveries';
import { etaRange, naira } from '../lib/format';

/** Prototype tracking: mock timeline + placeholder map, no real GPS. */
export default function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deliveryById } = useStore();
  const delivery = deliveryById(id);

  if (!delivery) {
    return (
      <Screen title="Delivery not found">
        <button className="btn btn--primary btn--lg btn--block" onClick={() => navigate('/home')}>
          Back to home
        </button>
      </Screen>
    );
  }

  const partner = partnerById(delivery.partnerId);
  const vehicle = partner ? vehicleById(partner.vehicle) : null;
  const live = delivery.status === DELIVERY_STATUS.inProgress;
  const delivered = delivery.status === DELIVERY_STATUS.delivered;
  const cancelled = delivery.status === DELIVERY_STATUS.cancelled;
  const step = TRACKING_STEPS[Math.min(delivery.stepIndex, TRACKING_STEPS.length - 1)];
  const phone = (PARTNER_PHONES[delivery.partnerId] || '0800 000 0000').replace(/\s/g, '');

  return (
    <Screen
      onBack={() => navigate(-1)}
      title={delivery.id}
      subtitle={cancelled ? 'Cancelled' : delivered ? 'Completed' : step.label}
      right={<StatusPill status={delivery.status} />}
    >
      <MapPlaceholder delivery={delivery} live={live} />

      {cancelled ? (
        <div className="matchnote" style={{ background: 'var(--danger-100)', borderColor: 'var(--danger-100)' }}>
          <span className="matchnote__icon" style={{ background: 'var(--danger-500)' }}>
            <Icon name="info" size={16} />
          </span>
          <span className="matchnote__text">
            This delivery was cancelled before pickup. Nothing was charged.
          </span>
        </div>
      ) : (
        <div className="track__eta">
          <span className="track__etaicon">
            <Icon name={delivered ? 'checkCircle' : 'clock'} size={20} />
          </span>
          <span className="track__etatext">
            <span className="track__etalabel">
              {delivered ? 'Delivered · thank you!' : 'Estimated arrival'}
            </span>
            <span className="track__etavalue num">
              {delivered ? 'Package handed over' : etaRange(delivery.etaRange)}
            </span>
          </span>
          <span className="num" style={{ marginLeft: 'auto', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
            {naira(delivery.price)}
          </span>
        </div>
      )}

      {partner ? (
        <div className="track__partner">
          <Avatar src={partner.photo} name={partner.name} size={46} verified={partner.verified} />
          <span className="track__partnermeta">
            <span className="track__partnername">
              {partner.name}
              <RatingBadge value={partner.rating} />
            </span>
            <span className="track__partnerves">
              {vehicle.emoji} {vehicle.label} · {partner.deliveries} deliveries
            </span>
          </span>
          <a className="track__call" href={`tel:${phone}`} aria-label={`Call ${partner.name}`}>
            <Icon name="phoneCall" size={19} />
          </a>
        </div>
      ) : null}

      <div className="card">
        <RouteLines
          compact
          pickup={{ zoneId: delivery.pickupZone, line: delivery.pickupLine }}
          dropoff={{ zoneId: delivery.dropoffZone, line: delivery.dropoffLine }}
        />
      </div>

      <div className="card">
        <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--sp-3)' }}>
          Delivery progress
        </span>
        <StatusTimeline delivery={delivery} />
      </div>

      {live ? (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-400)' }}>
          Status updates automatically in this prototype — watch the timeline move.
        </p>
      ) : null}
    </Screen>
  );
}
