import { forwardRef } from 'react';
import Icon from './Icon';

/**
 * Primary interactive element. One obvious action per screen is a product
 * rule, so the primary variant is deliberately the loudest thing on screen.
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'lg',
    block = false,
    icon,
    iconRight,
    loading = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={size === 'sm' ? 16 : 18} /> : null}
      <span className="btn__label">{children}</span>
      {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 16 : 18} /> : null}
    </button>
  );
});

export default Button;
