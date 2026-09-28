import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import { partnerById } from '../../data/partners';
import { vehicleById } from '../../data/vehicles';
import { zoneName } from '../../data/locations';
import { TRACKING_STEPS } from '../../data/deliveries';

/** Compact "you have a delivery moving right now" card on the home screen. */
export default function ActiveDeliveryCard({ delivery }) {
  const navigate = useNavigate();
  const partner = partnerById(delivery.partnerId);
  const vehicle = partner ? vehicleById(partner.vehicle) : null;
  const step = TRACKING_STEPS[delivery.stepIndex];

  return (
    <section className="active" aria-label="Active delivery">
      <div className="active__head">
        <span className="active__live">
          <span className="active__livedot" aria-hidden="true" />
          {step.label}
        </span>
        <span className="active__id num">{delivery.id}</span>
      </div>

      <div className="active__route">
        <span className="active__zone">{zoneName(delivery.pickupZone)}</span>
        <Icon name="arrowRight" size={14} />
        <span className="active__zone">{zoneName(delivery.dropoffZone)}</span>
      </div>

      {partner ? (
        <div className="active__partner">
          <Avatar src={partner.photo} name={partner.name} size={32} verified={partner.verified} />
          <span className="active__partnermeta">
            <span className="active__partnername">{partner.name}</span>
            <span className="active__partnerves">
              {vehicle.emoji} {vehicle.label}
            </span>
          </span>
          <span className="active__eta num">~{delivery.etaRange[1]} min</span>
        </div>
      ) : null}

      <button className="active__cta" onClick={() => navigate(`/track/${delivery.id}`)}>
        Track delivery
        <Icon name="chevronRight" size={16} />
      </button>
    </section>
  );
}
