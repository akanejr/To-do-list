/**
 * Mock service-area zones for the prototype city (Port Harcourt, Rivers State).
 * Coordinates are approximate and used only to derive believable distances.
 * In Phase 2+ this module is replaced by a real geocoding / zones API.
 */

export const CITY_NAME = 'Port Harcourt';

export const ZONES = [
  { id: 'rumuola', name: 'Rumuola', lat: 4.8392, lng: 7.0316 },
  { id: 'woji', name: 'Woji', lat: 4.812, lng: 7.045 },
  { id: 'gra2', name: 'GRA Phase 2', lat: 4.815, lng: 7.015 },
  { id: 'oldgra', name: 'Old GRA', lat: 4.818, lng: 7.005 },
  { id: 'transamadi', name: 'Trans-Amadi', lat: 4.803, lng: 7.008 },
  { id: 'dline', name: 'D-Line', lat: 4.812, lng: 7.006 },
  { id: 'mile1', name: 'Mile 1', lat: 4.806, lng: 7.0 },
  { id: 'garrison', name: 'Garrison', lat: 4.809, lng: 6.995 },
  { id: 'waterlines', name: 'Waterlines', lat: 4.79, lng: 7.03 },
  { id: 'rumuokoro', name: 'Rumuokoro', lat: 4.848, lng: 6.99 },
  { id: 'eliozu', name: 'Eliozu', lat: 4.878, lng: 6.97 },
  { id: 'adageorge', name: 'Ada George', lat: 4.852, lng: 6.968 },
  { id: 'rumuigbo', name: 'Rumuigbo', lat: 4.845, lng: 7.005 },
  { id: 'peterodili', name: 'Peter Odili Road', lat: 4.83, lng: 7.025 },
  { id: 'choba', name: 'Choba', lat: 4.886, lng: 6.92 },
];

export const zoneById = (id) => ZONES.find((z) => z.id === id) || null;

export const zoneName = (id) => zoneById(id)?.name || '—';
