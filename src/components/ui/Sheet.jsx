import { useEffect } from 'react';
import Icon from './Icon';

/**
 * Bottom sheet for progressive disclosure (e.g. "Why these partners?").
 * Closes on backdrop tap, Escape, or the close button.
 */
export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label={title}>
      <button className="sheet__backdrop" aria-label="Close" onClick={onClose} />
      <div className="sheet">
        <span className="sheet__grab" aria-hidden="true" />
        <div className="sheet__head">
          <h3 className="sheet__title">{title}</h3>
          <button className="sheet__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}
