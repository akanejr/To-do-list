import Icon from './Icon';

/** Labelled form control with optional hint / error and leading icon. */
export default function Field({
  label,
  hint,
  error,
  icon,
  htmlFor,
  children,
  trailing,
  className = '',
}) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      <div className="field__head">
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
        {trailing}
      </div>
      <div className="field__control">
        {icon ? (
          <span className="field__icon" aria-hidden="true">
            <Icon name={icon} size={18} />
          </span>
        ) : null}
        {children}
      </div>
      {error ? (
        <p className="field__error" role="alert">
          <Icon name="info" size={13} /> {error}
        </p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
