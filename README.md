# SwiftLine — Phase 1 Customer Prototype

A mobile-first prototype for a local Nigerian delivery & logistics **marketplace**:
customers request a delivery and choose from suitable, available delivery partners
based on vehicle, capacity, rating, availability and capabilities.

> **Prototype only.** No production backend, payments, real GPS, auth, database or
> third-party API integrations. All data is realistic mock data held in `src/data/`
> and local state, structured so a real backend can replace it in Phase 2+ without
> redesigning the screens.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Optimised for a smartphone viewport; on desktop the app renders as a framed
mobile column. Use your browser's device toolbar (≈390×844) for the intended view.

### Dev checks (no browser needed)

```bash
npm run check:matching   # prints which partners match / are excluded for sample requests
npm run check:smoke      # server-renders every route to catch runtime crashes
```

---

## The customer journey (all wired, no dead buttons)

Splash → Home → Send a Package → Pickup → Destination → Package → Pickup time →
Estimate → Available Partners → Partner Profile → Confirm → Delivery Created →
Track Delivery → History.

New bookings automatically advance through the mock tracking timeline so the
state machine is visible without real GPS.

---

## Architecture

```
src/
  data/          # MOCK BACKEND — swap this folder for a real API in Phase 2+
    locations.js   service-area zones (Port Harcourt) + coordinates
    vehicles.js    vehicle classes: capacity, range, speed, base fares
    packages.js    package sizes, item types, quick categories
    partners.js    the partner marketplace (incl. busy/offline partners)
    reviews.js     a few realistic reviews per partner
    deliveries.js  current user, saved addresses, seeded history, tracking steps
  lib/           # pure business logic (no React)
    geo.js         haversine + road-distance approximation
    pricing.js     transparent fare + ETA engine
    matching.js    6-dimension partner filtering + fit scoring
    format.js      ₦ / phone / date / time formatting
  state/
    store.jsx      draft + bookings + selection (localStorage-persisted)
  components/
    ui/            Button, Field, Toggle, Segmented, Sheet, Avatar, pills…
    layout/        Screen scaffold, TopBar, TabBar
    delivery/      PartnerCard, StatusTimeline, MapPlaceholder, RouteLines…
    brand/         placeholder logo + name (identity may change later)
  screens/         one file per Phase 1 screen
```

Screens depend only on `state/store` + `components`, never on raw mock data
shapes directly where avoidable — so replacing `data/` + `lib/` with API calls
touches few files.

## Partner matching (the marketplace idea, in miniature)

A partner is shown **only** if they pass all six checks:

1. available now (not busy / offline)
2. vehicle class accepts the package size
3. vehicle can carry the stated weight
4. distance is within the vehicle's practical range
5. partner covers **both** pickup and drop-off zones
6. capabilities cover the item type and the fragile flag

Survivors are scored (rating, experience, price, speed) and capped at five so the
list stays scannable. Excluded partners and their reasons are explainable via the
"Why not all N?" sheet — matching feels intelligent, never arbitrary.

## Deliberately NOT built (later phases)

Admin / rider / restaurant dashboards, real payments, real GPS & live tracking,
database, authentication, wallet, commissions, payouts, analytics, chat,
referrals, subscriptions.
