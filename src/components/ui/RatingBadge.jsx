import Icon from './Icon';

/** ⭐ 4.9 style rating chip. */
export default function RatingBadge({ value, className = '' }) {
  return (
    <span className={`rating ${className}`}>
      <Icon name="star" size={13} />
      <span className="num">{value.toFixed(1)}</span>
    </span>
  );
}
