/** Simple label → value rows for the estimate & confirm screens. */
export default function SummaryList({ rows, className = '' }) {
  return (
    <dl className={`summary ${className}`}>
      {rows.map((row) => (
        <div className="summary__row" key={row.label}>
          <dt className="summary__label">{row.label}</dt>
          <dd className={`summary__value ${row.emphasis ? 'summary__value--strong' : ''} ${row.num ? 'num' : ''}`}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
