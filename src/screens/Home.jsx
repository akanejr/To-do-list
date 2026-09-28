import { useNavigate } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Icon from '../components/ui/Icon';
import { LogoMark, BRAND_NAME } from '../components/brand/Logo';
import CategoryGrid from '../components/delivery/CategoryGrid';
import SavedAddressList from '../components/delivery/SavedAddressList';
import ActiveDeliveryCard from '../components/delivery/ActiveDeliveryCard';
import HistoryCard from '../components/delivery/HistoryCard';
import { useStore } from '../state/store';
import { CURRENT_USER } from '../data/deliveries';
import { CITY_NAME } from '../data/locations';

/**
 * Answers one question immediately: "How can we help you today?"
 * One loud primary action, then shortcuts that save typing.
 */
export default function Home() {
  const navigate = useNavigate();
  const { activeDelivery, bookings, updateDraft, resetDraft } = useStore();
  const recent = bookings.slice(0, 2);

  const startWithCategory = (cat) => {
    resetDraft();
    updateDraft({ itemType: cat.itemType, package: { size: cat.size } });
    navigate('/send');
  };

  const startWithAddress = (addr) => {
    resetDraft();
    updateDraft({
      pickup: {
        zoneId: addr.zoneId,
        line1: addr.line1,
        contactName: addr.contactName,
        contactPhone: addr.contactPhone,
      },
    });
    navigate('/send');
  };

  return (
    <Screen tabBar>
      <header className="home__hero">
        <div className="sectionhead" style={{ alignItems: 'center' }}>
          <span className="home__brand">
            <LogoMark size={34} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
              {BRAND_NAME}
            </span>
          </span>
          <span className="vchip">
            <Icon name="mapPin" size={13} />
            {CITY_NAME}
          </span>
        </div>
        <p className="home__hello">Good day, {CURRENT_USER.name.split(' ')[0]} 👋</p>
        <h1 className="home__title">How can we help you today?</h1>
      </header>

      <button className="home__primary" onClick={() => navigate('/send')}>
        <span className="home__primaryicon">
          <Icon name="package" size={24} />
        </span>
        <span className="home__primarytext">
          <span className="home__primarytitle">Send a package</span>
          <span className="home__primarysub" style={{ display: 'block' }}>
            Get it picked up and delivered today
          </span>
        </span>
        <Icon name="chevronRight" size={22} />
      </button>

      {activeDelivery ? <ActiveDeliveryCard delivery={activeDelivery} /> : null}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <div className="sectionhead">
          <h2>What are you sending?</h2>
        </div>
        <CategoryGrid onPick={startWithCategory} />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <div className="sectionhead">
          <h2>Saved addresses</h2>
        </div>
        <SavedAddressList onPick={startWithAddress} />
      </section>

      {recent.length > 0 ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div className="sectionhead">
            <h2>Recent deliveries</h2>
            <button onClick={() => navigate('/history')}>
              See all <Icon name="chevronRight" size={14} />
            </button>
          </div>
          {recent.map((d) => (
            <button key={d.id} className="cardbtn" onClick={() => navigate(`/track/${d.id}`)}>
              <HistoryCard delivery={d} />
            </button>
          ))}
        </section>
      ) : null}
    </Screen>
  );
}
