/**
 * Vehicle classes available on the marketplace.
 * Drives capacity checks, distance limits, speed assumptions and base fares.
 */

export const VEHICLES = {
  bicycle: {
    id: 'bicycle',
    label: 'Bicycle',
    emoji: '🚲',
    blurb: 'Best for light, short trips',
    capacity: ['document', 'small', 'medium'],
    maxWeightKg: 12,
    maxKm: 8,
    speedKmh: 14,
    baseFare: 600,
    perKm: 110,
    dispatchMin: 6,
  },
  motorcycle: {
    id: 'motorcycle',
    label: 'Motorcycle',
    emoji: '🏍️',
    blurb: 'Fast through traffic',
    capacity: ['document', 'small', 'medium'],
    maxWeightKg: 20,
    maxKm: 25,
    speedKmh: 26,
    baseFare: 900,
    perKm: 150,
    dispatchMin: 5,
  },
  tricycle: {
    id: 'tricycle',
    label: 'Tricycle (Keke)',
    emoji: '🛺',
    blurb: 'Roomy for bulky items',
    capacity: ['small', 'medium', 'large'],
    maxWeightKg: 60,
    maxKm: 18,
    speedKmh: 20,
    baseFare: 1100,
    perKm: 170,
    dispatchMin: 7,
  },
  car: {
    id: 'car',
    label: 'Car',
    emoji: '🚗',
    blurb: 'Safe, covered and flexible',
    capacity: ['document', 'small', 'medium', 'large'],
    maxWeightKg: 80,
    maxKm: 45,
    speedKmh: 24,
    baseFare: 1600,
    perKm: 210,
    dispatchMin: 6,
  },
  van: {
    id: 'van',
    label: 'Van',
    emoji: '🚐',
    blurb: 'For big or multiple loads',
    capacity: ['small', 'medium', 'large', 'xl'],
    maxWeightKg: 400,
    maxKm: 50,
    speedKmh: 22,
    baseFare: 2200,
    perKm: 250,
    dispatchMin: 8,
  },
};

export const vehicleById = (id) => VEHICLES[id] || null;
