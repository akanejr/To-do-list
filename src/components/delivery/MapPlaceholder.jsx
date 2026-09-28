import { zoneName } from '../../data/locations';

/**
 * Phase 1 map placeholder: an abstract city grid with the route drawn on it
 * and the partner marker gliding along the path. No real map integration.
 */
export default function MapPlaceholder({ delivery, live = false }) {
  return (
    <div className="mapbox" role="img" aria-label={`Route map from ${zoneName(delivery.pickupZone)} to ${zoneName(delivery.dropoffZone)}`}>
      <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" className="mapbox__svg">
        <defs>
          <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef5f0" />
            <stop offset="100%" stopColor="#e2ede6" />
          </linearGradient>
        </defs>
        <rect width="360" height="200" fill="url(#mapbg)" />

        {/* abstract street grid */}
        <g stroke="#d3e2d8" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M-10 46 H370" />
          <path d="M-10 118 H370" />
          <path d="M-10 168 H370" />
          <path d="M52 -10 V210" />
          <path d="M148 -10 V210" />
          <path d="M252 -10 V210" />
          <path d="M318 -10 V210" />
        </g>
        <g stroke="#e7f0ea" strokeWidth="3" fill="none">
          <path d="M-10 82 H370" />
          <path d="M100 -10 V210" />
          <path d="M200 -10 V210" />
        </g>

        {/* park + water hints */}
        <rect x="160" y="56" width="78" height="50" rx="10" fill="#d9ecdf" />
        <path d="M262 128 q40 -14 96 6 v66 h-96 z" fill="#cfe3ee" />

        {/* route */}
        <path
          id="routePath"
          d="M52 168 C 90 168 96 118 148 118 S 226 118 252 46"
          fill="none"
          stroke="#0E8A54"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="1 10"
        />

        {/* origin */}
        <g>
          <circle cx="52" cy="168" r="9" fill="#0E8A54" opacity="0.18" />
          <circle cx="52" cy="168" r="5" fill="#0E8A54" stroke="#fff" strokeWidth="2.4" />
        </g>
        {/* destination */}
        <g>
          <circle cx="252" cy="46" r="9" fill="#0c1b14" opacity="0.14" />
          <circle cx="252" cy="46" r="5" fill="#0c1b14" stroke="#fff" strokeWidth="2.4" />
        </g>

        {/* moving partner marker */}
        {live ? (
          <g>
            <circle r="11" fill="#0E8A54" opacity="0.2">
              <animateMotion dur="7s" repeatCount="indefinite" rotate="0">
                <mpath href="#routePath" />
              </animateMotion>
            </circle>
            <circle r="6.5" fill="#0E8A54" stroke="#fff" strokeWidth="2.6">
              <animateMotion dur="7s" repeatCount="indefinite" rotate="0">
                <mpath href="#routePath" />
              </animateMotion>
            </circle>
          </g>
        ) : null}
      </svg>

      <span className="mapbox__chip">
        <span className="mapbox__chipdot" aria-hidden="true" />
        Map preview · live GPS in Phase 2
      </span>
    </div>
  );
}
