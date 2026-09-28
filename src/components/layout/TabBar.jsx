import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

/**
 * Minimal bottom navigation: Home · Send · History.
 * The centre action is the product's single most important verb.
 */
export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Primary">
      <NavLink to="/home" className={({ isActive }) => `tabbar__item ${isActive ? 'is-active' : ''}`}>
        {({ isActive }) => (
          <>
            <Icon name="home" size={21} />
            <span>Home</span>
            {isActive ? <span className="tabbar__indicator" /> : null}
          </>
        )}
      </NavLink>

      <NavLink to="/send" className="tabbar__fab" aria-label="Send a package">
        <Icon name="navigation" size={22} />
      </NavLink>

      <NavLink to="/history" className={({ isActive }) => `tabbar__item ${isActive ? 'is-active' : ''}`}>
        {({ isActive }) => (
          <>
            <Icon name="history" size={21} />
            <span>History</span>
            {isActive ? <span className="tabbar__indicator" /> : null}
          </>
        )}
      </NavLink>
    </nav>
  );
}
