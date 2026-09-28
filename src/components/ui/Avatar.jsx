/** Partner photo with optional verified badge and presence dot. */
export default function Avatar({ src, name, size = 48, verified = false, className = '' }) {
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size }}>
      <img className="avatar__img" src={src} alt={`${name} profile photo`} loading="lazy" />
      {verified ? (
        <span className="avatar__badge" title="Verified partner" aria-label="Verified partner">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      ) : null}
    </span>
  );
}
