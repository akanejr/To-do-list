/** Accessible switch used for the "Fragile" option. */
export default function Toggle({ checked, onChange, label, description, id }) {
  return (
    <label className={`toggle-row ${checked ? 'toggle-row--on' : ''}`} htmlFor={id}>
      <span className="toggle-row__text">
        <span className="toggle-row__label">{label}</span>
        {description ? <span className="toggle-row__desc">{description}</span> : null}
      </span>
      <span className="toggle" aria-hidden="true">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle__track">
          <span className="toggle__knob" />
        </span>
      </span>
    </label>
  );
}
