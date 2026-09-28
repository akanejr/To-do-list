import Icon from '../ui/Icon';
import { SAVED_ADDRESSES } from '../../data/deliveries';
import { zoneName } from '../../data/locations';

/** Horizontal saved-address chips on the home screen. */
export default function SavedAddressList({ onPick }) {
  return (
    <div className="saved" role="list" aria-label="Saved addresses">
      {SAVED_ADDRESSES.map((addr) => (
        <button key={addr.id} className="saved__item" role="listitem" onClick={() => onPick(addr)}>
          <span className="saved__icon">
            <Icon name={addr.icon} size={15} />
          </span>
          <span className="saved__text">
            <span className="saved__label">{addr.label}</span>
            <span className="saved__zone">{zoneName(addr.zoneId)}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
