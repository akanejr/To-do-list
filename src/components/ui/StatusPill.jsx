import { DELIVERY_STATUS } from '../../data/deliveries';

const MAP = {
  [DELIVERY_STATUS.delivered]: { cls: 'pill--delivered', label: 'Delivered' },
  [DELIVERY_STATUS.inProgress]: { cls: 'pill--progress', label: 'In progress' },
  [DELIVERY_STATUS.cancelled]: { cls: 'pill--cancelled', label: 'Cancelled' },
};

export default function StatusPill({ status, className = '' }) {
  const conf = MAP[status] || { cls: 'pill--neutral', label: status };
  return (
    <span className={`pill ${conf.cls} ${className}`}>
      <span className="pill__dot" aria-hidden="true" />
      {conf.label}
    </span>
  );
}
