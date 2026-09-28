import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import TabBar from './TabBar';

/** Circular back affordance used by every pushed screen. */
export function BackButton({ onClick, label = 'Back' }) {
  return (
    <button className="iconbtn" onClick={onClick} aria-label={label}>
      <Icon name="chevronLeft" size={20} />
    </button>
  );
}

export function TopBar({ title, subtitle, onBack, right, centered = false }) {
  return (
    <header className={`topbar ${centered ? 'topbar--centered' : ''}`}>
      <div className="topbar__left">
        {onBack ? <BackButton onClick={onBack} /> : <span className="topbar__spacer" />}
        <div className="topbar__titles">
          {title ? <h1 className="topbar__title">{title}</h1> : null}
          {subtitle ? <p className="topbar__subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {right ? <div className="topbar__right">{right}</div> : null}
    </header>
  );
}

/**
 * The single scroll container every screen lives in.
 * Keeps the primary action pinned at the bottom (thumb reach) and the header
 * pinned at the top, so the customer never feels lost.
 */
export default function Screen({
  title,
  subtitle,
  onBack,
  right,
  children,
  footer,
  tabBar = false,
  wide = false,
  className = '',
}) {
  const navigate = useNavigate();
  return (
    <div className={`screen ${wide ? 'screen--wide' : ''} ${className}`}>
      {title || onBack || right ? (
        <TopBar title={title} subtitle={subtitle} onBack={onBack === undefined ? () => navigate(-1) : onBack || undefined} right={right} />
      ) : null}
      <main className="screen__body">{children}</main>
      {footer ? <div className="screen__footer">{footer}</div> : null}
      {tabBar ? <TabBar /> : null}
    </div>
  );
}
