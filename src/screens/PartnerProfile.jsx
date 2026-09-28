import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';
import RatingBadge from '../components/ui/RatingBadge';
import { CapacityGrid, VehicleLine } from '../components/delivery/PartnerCard';
import { useStore } from '../state/store';
import { partnerById } from '../data/partners';
import { reviewsFor } from '../data/reviews';
import { zoneName, CITY_NAME } from '../data/locations';
import { buildRequest } from '../lib/matching';
import { computeQuote } from '../lib/pricing';
import { naira, etaRange, formatDate } from '../lib/format';

/** Full partner profile — trust building before commitment. */
export default function PartnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { draft, setSelectedPartnerId } = useStore();
  const partner = partnerById(id);

  const quote = useMemo(() => {
    if (!partner || !draft.pickup.zoneId || !draft.dropoff.zoneId) return null;
    const request = buildRequest(draft);
    return computeQuote({
      vehicleId: partner.vehicle,
      distanceKm: request.distanceKm,
      sizeId: request.sizeId,
      itemType: request.itemType,
      fragile: request.fragile,
      scheduleMode: request.scheduleMode,
      priceFactor: partner.priceFactor,
    });
  }, [partner, draft]);

  if (!partner) {
    return (
      <Screen onBack={() => navigate('/partners')} title="Partner not found">
        <Button block onClick={() => navigate('/partners')}>
          Back to partners
        </Button>
      </Screen>
    );
  }

  const reviews = reviewsFor(partner.id);
  const years = new Date().getFullYear() - partner.joinedYear;

  return (
    <Screen
      onBack={() => navigate('/partners')}
      title="Delivery partner"
      subtitle="Verified by SwiftLine"
      footer={
        <Button
          block
          size="lg"
          icon="check"
          onClick={() => {
            setSelectedPartnerId(partner.id);
            navigate('/confirm');
          }}
        >
          Select this partner
        </Button>
      }
    >
      <div className="profile__hero">
        <Avatar src={partner.photo} name={partner.name} size={88} verified={partner.verified} />
        <div>
          <h2 className="profile__name">{partner.fullName}</h2>
          <div className="profile__meta">
            <RatingBadge value={partner.rating} />
            <span className="pcard__dot" aria-hidden="true" />
            <span className="num">{partner.deliveries} deliveries</span>
            <span className="pcard__dot" aria-hidden="true" />
            <span>{years > 0 ? `${years} yr on SwiftLine` : 'New this year'}</span>
          </div>
        </div>
        <p className="profile__bio">“{partner.bio}”</p>
        <div className="profile__stats">
          <div className="stat">
            <span className="stat__label">
              <Icon name="star" size={12} /> Rating
            </span>
            <span className="stat__value num">{partner.rating.toFixed(1)}</span>
          </div>
          <div className="stat">
            <span className="stat__label">
              <Icon name="package" size={12} /> Done
            </span>
            <span className="stat__value num">{partner.deliveries}</span>
          </div>
          <div className="stat">
            <span className="stat__label">
              <Icon name="clock" size={12} /> This trip
            </span>
            <span className="stat__value num">{quote ? `${quote.etaRange[0]} min` : '—'}</span>
          </div>
        </div>
        {quote ? (
          <div className="total" style={{ width: '100%' }}>
            <span className="total__label">For this delivery · {etaRange(quote.etaRange)}</span>
            <span className="total__value num">{naira(quote.price)}</span>
          </div>
        ) : null}
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <div>
          <span className="eyebrow">Vehicle</span>
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <VehicleLine partner={partner} />
          </div>
        </div>
        <div>
          <span className="eyebrow">Package capacity</span>
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <CapacityGrid partner={partner} />
          </div>
        </div>
        <div>
          <span className="eyebrow">What they carry</span>
          <div className="pcard__caps" style={{ marginTop: 'var(--sp-2)' }}>
            {partner.capabilityLabels.map((c) => (
              <span className="cap" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">Service area</span>
          <div className="pcard__caps" style={{ marginTop: 'var(--sp-2)' }}>
            {partner.serviceZones === 'all' ? (
              <span className="cap">All of {CITY_NAME}</span>
            ) : (
              partner.serviceZones.map((z) => (
                <span className="cap" key={z}>
                  {zoneName(z)}
                </span>
              ))
            )}
          </div>
        </div>
        <div>
          <span className="eyebrow">Speaks</span>
          <p style={{ fontSize: 13.5, color: 'var(--ink-700)', marginTop: 6, fontWeight: 600 }}>
            {partner.languages.join(' · ')}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="sectionhead" style={{ marginBottom: 'var(--sp-2)' }}>
          <h2>Customer reviews</h2>
          <span className="num" style={{ fontSize: 12.5, color: 'var(--ink-400)', fontWeight: 700 }}>
            {reviews.length} recent
          </span>
        </div>
        {reviews.map((r) => (
          <div className="review" key={r.id}>
            <span className="review__avatar">{r.author.slice(0, 2).toUpperCase()}</span>
            <div className="review__body">
              <div className="review__head">
                <span className="review__author">{r.author}</span>
                <span className="review__date num">{formatDate(r.date)}</span>
              </div>
              <RatingBadge value={r.rating} />
              <p className="review__text">“{r.text}”</p>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
