import Avatar from '../ui/Avatar';
import RatingBadge from '../ui/RatingBadge';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { vehicleById } from '../../data/vehicles';
import { PACKAGE_SIZES } from '../../data/packages';
import { naira } from '../../lib/format';
import { matchLabel } from '../../lib/matching';

const sizeShort = { document: 'Doc', small: 'Small', medium: 'Medium', large: 'Large', xl: 'XL' };

/**
 * A marketplace listing: who they are, what they can carry, how fast,
 * how much — plus an explicit profile view and a select action.
 */
export default function PartnerCard({ entry, onSelect, onViewProfile, selected = false }) {
  const { partner, quote, score } = entry;
  const vehicle = vehicleById(partner.vehicle);
  const capacity = vehicle.capacity
    .filter((c) => c !== 'xl')
    .map((c) => sizeShort[c])
    .join(' / ');

  return (
    <article className={`pcard ${selected ? 'pcard--selected' : ''}`}>
      <div className="pcard__top">
        <Avatar src={partner.photo} name={partner.name} size={52} verified={partner.verified} />
        <div className="pcard__id">
          <div className="pcard__namerow">
            <h3>{partner.name}</h3>
            <span className="pcard__match">{matchLabel(score)}</span>
          </div>
          <div className="pcard__meta">
            <RatingBadge value={partner.rating} />
            <span className="pcard__dot" aria-hidden="true" />
            <span className="num">{partner.deliveries} deliveries</span>
          </div>
        </div>
        <div className="pcard__price">
          <span className="pcard__amount num">{naira(quote.price)}</span>
          <span className="pcard__eta num">ETA {quote.etaRange[0]} min</span>
        </div>
      </div>

      <div className="pcard__row">
        <span className="vchip">
          <span className="vchip__emoji" aria-hidden="true">{vehicle.emoji}</span>
          {vehicle.label}
        </span>
        <span className="pcard__cap">Capacity: {capacity}</span>
      </div>

      <div className="pcard__caps" aria-label="What they can carry">
        {partner.capabilityLabels.slice(0, 3).map((c) => (
          <span className="cap" key={c}>{c}</span>
        ))}
      </div>

      <div className="pcard__actions">
        <Button variant="secondary" size="md" onClick={onViewProfile}>
          View profile
        </Button>
        <Button
          variant={selected ? 'dark' : 'primary'}
          size="md"
          icon={selected ? 'check' : undefined}
          onClick={onSelect}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </article>
  );
}

/** One-line capability/vehicle summary reused on the profile screen. */
export function VehicleLine({ partner }) {
  const vehicle = vehicleById(partner.vehicle);
  return (
    <span className="vchip vchip--lg">
      <span className="vchip__emoji" aria-hidden="true">{vehicle.emoji}</span>
      {vehicle.label}
      <span className="vchip__blurb">{vehicle.blurb}</span>
    </span>
  );
}

export function CapacityGrid({ partner }) {
  const vehicle = vehicleById(partner.vehicle);
  return (
    <div className="capgrid">
      {PACKAGE_SIZES.map((s) => {
        const ok = vehicle.capacity.includes(s.id);
        return (
          <span className={`capgrid__item ${ok ? 'is-ok' : 'is-no'}`} key={s.id}>
            <Icon name={ok ? 'check' : 'close'} size={12} />
            {s.label}
          </span>
        );
      })}
    </div>
  );
}
