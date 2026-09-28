/**
 * Placeholder brand mark. Identity is intentionally simple — the company name
 * and final logo may change after Phase 1, so nothing depends on this beyond
 * a name string and one glyph.
 */
export const BRAND_NAME = 'SwiftLine';
export const BRAND_TAGLINE = 'Your city, delivered in minutes.';

export function LogoMark({ size = 40, tone = 'brand' }) {
  const bg = tone === 'light' ? 'rgba(255,255,255,0.14)' : undefined;
  return (
    <span
      className="logo-mark"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: bg,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" width={size * 0.62} height={size * 0.62} fill="none">
        <path
          d="M7 20.5l6.6-6.6 3.6 3.6L25 9.7"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.2 9.7H25v4.8"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="20.5" r="2.4" fill="currentColor" />
      </svg>
    </span>
  );
}

export default LogoMark;
