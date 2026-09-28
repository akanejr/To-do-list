import Icon from '../ui/Icon';
import { QUICK_CATEGORIES } from '../../data/packages';

/** Quick-start tiles: "what are you sending?" pre-fills the request flow. */
export default function CategoryGrid({ onPick }) {
  return (
    <div className="cats" role="list" aria-label="Quick delivery categories">
      {QUICK_CATEGORIES.map((cat) => (
        <button key={cat.id} className="cats__item" role="listitem" onClick={() => onPick(cat)}>
          <span className="cats__icon">
            <Icon name={cat.icon} size={19} />
          </span>
          <span className="cats__label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
