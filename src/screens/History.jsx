import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Icon from '../components/ui/Icon';
import HistoryCard from '../components/delivery/HistoryCard';
import { useStore } from '../state/store';
import { DELIVERY_STATUS } from '../data/deliveries';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: DELIVERY_STATUS.inProgress, label: 'In progress' },
  { id: DELIVERY_STATUS.delivered, label: 'Delivered' },
  { id: DELIVERY_STATUS.cancelled, label: 'Cancelled' },
];

/** Every delivery the customer has made, newest first. */
export default function History() {
  const navigate = useNavigate();
  const { bookings } = useStore();
  const [filter, setFilter] = useState('all');

  const list = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  );

  return (
    <Screen tabBar title="Delivery history" subtitle={`${bookings.length} deliveries total`}>
      <div className="itemtypes" role="tablist" aria-label="Filter deliveries">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={`itemtypes__item ${filter === f.id ? 'itemtypes__item--active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-7) var(--sp-4)' }}>
          <span style={{ fontSize: 34 }}>📦</span>
          <h3 style={{ marginTop: 'var(--sp-3)', fontSize: 17 }}>Nothing here yet</h3>
          <p style={{ color: 'var(--ink-500)', fontSize: 13.5, marginTop: 6 }}>
            Deliveries you make will show up here.
          </p>
        </div>
      ) : (
        list.map((d) => (
          <button key={d.id} className="cardbtn" onClick={() => navigate(`/track/${d.id}`)}>
            <HistoryCard delivery={d} />
          </button>
        ))
      )}

      {list.length > 0 ? (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <Icon name="info" size={13} />
          Tap any delivery to see its full journey
        </p>
      ) : null}
    </Screen>
  );
}
