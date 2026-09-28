/**
 * Local application state (Phase 1).
 *
 * Holds the in-progress delivery draft, the selected partner and the list of
 * bookings. Bookings created in-session are persisted to localStorage so the
 * journey survives a refresh; seeded mock history is merged in on load.
 * In Phase 2+ this provider is replaced by an API-backed store with the same
 * public surface, so screens do not change.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SEED_DELIVERIES, DELIVERY_STATUS, TRACKING_STEPS } from '../data/deliveries';
import { sizeById, itemTypeById } from '../data/packages';

const STORAGE_KEY = 'swiftline.phase1.v1';
const TICK_MS = 10000; // mock tracking cadence

export const emptyDraft = () => ({
  itemType: 'parcel',
  pickup: { zoneId: '', line1: '', contactName: '', contactPhone: '' },
  dropoff: { zoneId: '', line1: '', recipientName: '', recipientPhone: '' },
  package: { size: 'small', weightKg: '', description: '', fragile: false },
  schedule: { mode: 'asap', date: '', time: '' },
});

const StoreContext = createContext(null);

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bookings: [], draft: null, selectedPartnerId: null, step: 0 };
    const parsed = JSON.parse(raw);
    return {
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      draft: parsed.draft && typeof parsed.draft === 'object' ? parsed.draft : null,
      selectedPartnerId: parsed.selectedPartnerId || null,
      step: Number.isInteger(parsed.step) ? parsed.step : 0,
    };
  } catch {
    return { bookings: [], draft: null, selectedPartnerId: null, step: 0 };
  }
}

export function StoreProvider({ children }) {
  const initial = useRef(loadPersisted()).current;

  const [draft, setDraft] = useState(() => ({ ...emptyDraft(), ...(initial.draft || {}) }));
  const [selectedPartnerId, setSelectedPartnerId] = useState(initial.selectedPartnerId);
  const [userBookings, setUserBookings] = useState(initial.bookings);
  const [step, setStep] = useState(initial.step); // create-delivery wizard step

  // Persist user-created bookings + draft (never the seeded mocks).
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ bookings: userBookings, draft, selectedPartnerId, step }),
      );
    } catch {
      /* storage unavailable — prototype continues in memory */
    }
  }, [userBookings, draft, selectedPartnerId, step]);

  const updateDraft = useCallback((updater) => {
    setDraft((prev) => {
      const patch = typeof updater === 'function' ? updater(prev) : updater;
      const next = { ...prev };
      for (const [key, value] of Object.entries(patch)) {
        next[key] =
          value && typeof value === 'object' && !Array.isArray(value)
            ? { ...prev[key], ...value }
            : value;
      }
      return next;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft());
    setSelectedPartnerId(null);
    setStep(0);
  }, []);

  const allBookings = useMemo(
    () => [...userBookings, ...SEED_DELIVERIES].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [userBookings],
  );

  const activeDelivery = useMemo(
    () => allBookings.find((d) => d.status === DELIVERY_STATUS.inProgress) || null,
    [allBookings],
  );

  const deliveryById = useCallback(
    (id) => allBookings.find((d) => d.id === id) || null,
    [allBookings],
  );

  const createBooking = useCallback(
    ({ draft: d, partnerId, quote, request }) => {
      const seq = 2482 + userBookings.length;
      const now = new Date();
      const pickupEta = new Date(now.getTime() + quote.etaRange[0] * 20000);
      const booking = {
        id: `DL-${seq}`,
        createdAt: now.toISOString(),
        status: DELIVERY_STATUS.inProgress,
        stepIndex: 0,
        autoProgress: true,
        partnerId,
        itemType: d.itemType,
        sizeId: d.package.size,
        itemLabel: `${sizeById(d.package.size).label} · ${itemTypeById(d.itemType).label}`,
        pickupZone: d.pickup.zoneId,
        pickupLine: d.pickup.line1,
        pickupContact: d.pickup.contactName,
        dropoffZone: d.dropoff.zoneId,
        dropoffLine: d.dropoff.line1,
        dropoffContact: d.dropoff.recipientName,
        fragile: !!d.package.fragile,
        weightKg: d.package.weightKg,
        description: d.package.description,
        schedule: { ...d.schedule },
        distanceKm: request.distanceKm,
        price: quote.price,
        etaRange: quote.etaRange,
        pickupEta: pickupEta.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setUserBookings((prev) => [booking, ...prev]);
      return booking;
    },
    [userBookings.length],
  );

  // Mock tracking: newly created deliveries walk through the timeline so the
  // prototype visibly moves. Seeded deliveries stay put.
  useEffect(() => {
    const timer = setInterval(() => {
      setUserBookings((prev) => {
        let changed = false;
        const next = prev.map((b) => {
          if (!b.autoProgress || b.status !== DELIVERY_STATUS.inProgress) return b;
          if (b.stepIndex >= TRACKING_STEPS.length - 1) return b;
          changed = true;
          const stepIndex = b.stepIndex + 1;
          return {
            ...b,
            stepIndex,
            status: stepIndex >= TRACKING_STEPS.length - 1 ? DELIVERY_STATUS.delivered : b.status,
          };
        });
        return changed ? next : prev;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const value = useMemo(
    () => ({
      draft,
      updateDraft,
      resetDraft,
      step,
      setStep,
      selectedPartnerId,
      setSelectedPartnerId,
      bookings: allBookings,
      userBookings,
      activeDelivery,
      deliveryById,
      createBooking,
    }),
    [
      draft,
      updateDraft,
      resetDraft,
      step,
      selectedPartnerId,
      allBookings,
      userBookings,
      activeDelivery,
      deliveryById,
      createBooking,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
