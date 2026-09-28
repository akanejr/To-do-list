import StatusPill from '../ui/StatusPill';
import Avatar from '../ui/Avatar';
import Icon from '../ui/Icon';
import { partnerById } from '../../data/partners';
import { vehicleById } from '../../data/vehicles';
import { zoneName } from '../../data/locations';
import { naira, formatShortDate, formatTime } from '../../lib/format';

/** One past / ongoing delivery in the history list. Tappable -> tracking. */
export default function HistoryCard({ delivery }) {
  const partner = partnerById(delivery.partnerId);
  const vehicle = partner ? vehicleById(partner.vehicle) : null;

  return (
    <article className="hcard">
      <header className="hcard__head">
        <div>
          <span className="hcard__id num">{delivery.id}</span>
          <span className="hcard__date num">
            {formatShortDate(delivery.createdAt)} · {formatTime(delivery.createdAt)}
          </span>
        </div>
        <StatusPill status={delivery.status} />
      </header>

      <div className="hcard__route">
        <span className="hcard__zone">{zoneName(delivery.pickupZone)}</span>
        <Icon name="arrowRight" size={14} />
        <span className="hcard__zone">{zoneName(delivery.dropoffZone)}</span>
        <span className="hcard__item">{delivery.itemLabel}</span>
      </div>

      <footer className="hcard__foot">
        {partner ? (
          <span className="hcard__partner">
            <Avatar src={partner.photo} name={partner.name} size={26} />
            <span className="hcard__partnername">{partner.name}</span>
            <span className="hcard__vehicle" aria-hidden="true">{vehicle.emoji}</span>
          </span>
        ) : (
          <span className="hcard__partner">
            <span className="hcard__partnername">No partner</span>
          </span>
        )}
        <span className="hcard__amount num">{naira(delivery.price)}</span>
      </footer>
    </article>
  );
}
