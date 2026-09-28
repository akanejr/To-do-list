import { TRACKING_STEPS, DELIVERY_STATUS } from '../../data/deliveries';
import { formatTime } from '../../lib/format';
import Icon from '../ui/Icon';

const OFFSETS_MIN = [0, 2, 6, 14, 17, 39];

const timeFor = (createdAt, i) =>
  formatTime(new Date(new Date(createdAt).getTime() + OFFSETS_MIN[i] * 60000).toISOString());

/** Mock tracking timeline. Current step pulses; future steps stay quiet. */
export default function StatusTimeline({ delivery }) {
  const cancelled = delivery.status === DELIVERY_STATUS.cancelled;
  return (
    <ol className="timeline">
      {TRACKING_STEPS.map((step, i) => {
        const done = i < delivery.stepIndex || delivery.status === DELIVERY_STATUS.delivered;
        const current = !done && i === delivery.stepIndex && !cancelled;
        const last = i === TRACKING_STEPS.length - 1;
        return (
          <li className={`timeline__item ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`} key={step.id}>
            <span className="timeline__rail" aria-hidden="true">
              <span className="timeline__dot">
                {done ? <Icon name="check" size={11} strokeWidth={3.2} /> : null}
              </span>
              {!last ? <span className="timeline__line" /> : null}
            </span>
            <span className="timeline__content">
              <span className="timeline__label">{step.label}</span>
              <span className="timeline__detail">
                {done || current ? step.detail : 'Pending'}
              </span>
            </span>
            <span className="timeline__time num">
              {done ? timeFor(delivery.createdAt, i) : current ? 'Now' : ''}
            </span>
          </li>
        );
      })}
      {cancelled ? (
        <li className="timeline__item is-cancelled">
          <span className="timeline__rail" aria-hidden="true">
            <span className="timeline__dot">
              <Icon name="close" size={11} strokeWidth={3.2} />
            </span>
          </span>
          <span className="timeline__content">
            <span className="timeline__label">Cancelled</span>
            <span className="timeline__detail">This delivery was cancelled before pickup</span>
          </span>
        </li>
      ) : null}
    </ol>
  );
}
