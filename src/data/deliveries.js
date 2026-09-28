/**
 * Mock account data: the signed-in customer, saved addresses, past deliveries
 * and one delivery that is already in progress when the app opens.
 *
 * Bookings created in-session are merged with this list (see state/store.jsx).
 */

export const CURRENT_USER = {
  name: 'Chiamaka Obi',
  phone: '0803 442 1198',
  initials: 'CO',
};

export const SAVED_ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    zoneId: 'rumuola',
    line1: '14 Rumuola Road, by St. Mary’s junction',
    contactName: 'Chiamaka Obi',
    contactPhone: '0803 442 1198',
  },
  {
    id: 'office',
    label: 'Office',
    icon: 'briefcase',
    zoneId: 'gra2',
    line1: '2A Aba Road, GRA Phase 2 (blue gate)',
    contactName: 'Chiamaka Obi',
    contactPhone: '0803 442 1198',
  },
  {
    id: 'kitchen',
    label: 'Mama Nkechi’s kitchen',
    icon: 'food',
    zoneId: 'eliozu',
    line1: '5 Eze Street, off Ada George Road, Eliozu',
    contactName: 'Nkechi Umeh',
    contactPhone: '0706 215 8830',
  },
];

/** The six states every delivery moves through. Order matters. */
export const TRACKING_STEPS = [
  { id: 'confirmed', label: 'Request confirmed', detail: 'We received your request' },
  { id: 'assigned', label: 'Partner assigned', detail: 'Your delivery partner accepted' },
  { id: 'to_pickup', label: 'Partner heading to pickup', detail: 'On the way to collect' },
  { id: 'picked_up', label: 'Package picked up', detail: 'Package is with your partner' },
  { id: 'in_transit', label: 'In transit', detail: 'Moving to the destination' },
  { id: 'delivered', label: 'Delivered', detail: 'Handed over successfully' },
];

export const DELIVERY_STATUS = {
  inProgress: 'in_progress',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

/**
 * Seeded history. `stepIndex` is the current TRACKING_STEPS index for live ones.
 */
export const SEED_DELIVERIES = [
  {
    id: 'DL-2481',
    createdAt: '2026-09-28T08:42:00+01:00',
    status: DELIVERY_STATUS.inProgress,
    stepIndex: 4,
    partnerId: 'mike',
    itemType: 'parcel',
    sizeId: 'small',
    itemLabel: 'Small parcel',
    pickupZone: 'rumuola',
    pickupLine: '14 Rumuola Road, by St. Mary’s junction',
    dropoffZone: 'waterlines',
    dropoffLine: '7 Marine Base road, Waterlines',
    distanceKm: 6.2,
    price: 2600,
    etaRange: [30, 45],
    pickupEta: '9:05 AM',
  },
  {
    id: 'DL-2417',
    createdAt: '2026-09-24T13:10:00+01:00',
    status: DELIVERY_STATUS.delivered,
    stepIndex: 5,
    partnerId: 'aisha',
    itemType: 'food',
    sizeId: 'small',
    itemLabel: 'Food parcel',
    pickupZone: 'eliozu',
    pickupLine: '5 Eze Street, off Ada George Road',
    dropoffZone: 'woji',
    dropoffLine: '22 Okochi street, Woji',
    distanceKm: 5.1,
    price: 2400,
    etaRange: [30, 40],
    pickupEta: '1:25 PM',
  },
  {
    id: 'DL-2390',
    createdAt: '2026-09-19T10:05:00+01:00',
    status: DELIVERY_STATUS.delivered,
    stepIndex: 5,
    partnerId: 'david',
    itemType: 'documents',
    sizeId: 'document',
    itemLabel: 'Documents',
    pickupZone: 'gra2',
    pickupLine: '2A Aba Road, GRA Phase 2',
    dropoffZone: 'rumuola',
    dropoffLine: '14 Rumuola Road',
    distanceKm: 3.4,
    price: 1500,
    etaRange: [20, 30],
    pickupEta: '10:20 AM',
  },
  {
    id: 'DL-2351',
    createdAt: '2026-09-12T16:30:00+01:00',
    status: DELIVERY_STATUS.cancelled,
    stepIndex: 1,
    partnerId: 'samuel',
    itemType: 'parcel',
    sizeId: 'large',
    itemLabel: 'Large parcel',
    pickupZone: 'peterodili',
    pickupLine: '112 Peter Odili Road',
    dropoffZone: 'choba',
    dropoffLine: 'Uniport gate 2, Choba',
    distanceKm: 12.8,
    price: 4300,
    etaRange: [45, 65],
    pickupEta: '4:50 PM',
  },
  {
    id: 'DL-2302',
    createdAt: '2026-09-03T09:15:00+01:00',
    status: DELIVERY_STATUS.delivered,
    stepIndex: 5,
    partnerId: 'mike',
    itemType: 'parcel',
    sizeId: 'small',
    itemLabel: 'Small parcel',
    pickupZone: 'dline',
    pickupLine: '45 Abuloma street, D-Line',
    dropoffZone: 'rumuokoro',
    dropoffLine: 'Iwofe road junction, Rumuokoro',
    distanceKm: 4.6,
    price: 1900,
    etaRange: [25, 35],
    pickupEta: '9:35 AM',
  },
];
