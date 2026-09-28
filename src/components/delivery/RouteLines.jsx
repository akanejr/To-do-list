import { zoneName } from '../../data/locations';

/**
 * The pickup → drop-off visual used on estimate, confirm and tracking.
 * Green dot = origin, dark dot = destination, dashed connector = the journey.
 */
export default function RouteLines({ pickup, dropoff, compact = false }) {
  return (
    <div className={`route ${compact ? 'route--compact' : ''}`}>
      <div className="route__stop">
        <span className="route__marker route__marker--from" aria-hidden="true" />
        <div className="route__text">
          <span className="route__zone">{zoneName(pickup.zoneId)}</span>
          {!compact && pickup.line ? <span className="route__line">{pickup.line}</span> : null}
          {!compact && pickup.contact ? <span className="route__contact">{pickup.contact}</span> : null}
        </div>
      </div>
      <span className="route__connector" aria-hidden="true" />
      <div className="route__stop">
        <span className="route__marker route__marker--to" aria-hidden="true" />
        <div className="route__text">
          <span className="route__zone">{zoneName(dropoff.zoneId)}</span>
          {!compact && dropoff.line ? <span className="route__line">{dropoff.line}</span> : null}
          {!compact && dropoff.contact ? <span className="route__contact">{dropoff.contact}</span> : null}
        </div>
      </div>
    </div>
  );
}
