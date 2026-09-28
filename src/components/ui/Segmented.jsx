/** Two-or-more option segmented control (used for pickup preference). */
export default function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div className="seg" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={value === opt.id}
          className={`seg__item ${value === opt.id ? 'seg__item--active' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.icon ? (
            <span className="seg__icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {opt.icon}
              </svg>
            </span>
          ) : null}
          <span className="seg__text">
            <span className="seg__label">{opt.label}</span>
            {opt.hint ? <span className="seg__hint">{opt.hint}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
