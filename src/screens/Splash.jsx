import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoMark, BRAND_NAME, BRAND_TAGLINE } from '../components/brand/Logo';

const HOLD_MS = 1900;

/** Branded opening beat, then straight into the home screen. */
export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), HOLD_MS);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="splash">
      <span className="splash__mark">
        <LogoMark size={52} tone="light" />
      </span>
      <h1 className="splash__name">{BRAND_NAME}</h1>
      <p className="splash__tag">{BRAND_TAGLINE}</p>
      <span className="splash__loader" aria-hidden="true">
        <i />
      </span>
    </div>
  );
}
