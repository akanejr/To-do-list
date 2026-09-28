/**
 * Package sizes, item types and quick categories shown on the home screen.
 */

export const PACKAGE_SIZES = [
  {
    id: 'document',
    label: 'Document',
    hint: 'Envelope, papers, keys',
    maxKg: 2,
    multiplier: 1.0,
    handlingMin: 2,
  },
  {
    id: 'small',
    label: 'Small parcel',
    hint: 'Shoe-box size · up to 5 kg',
    maxKg: 5,
    multiplier: 1.12,
    handlingMin: 3,
  },
  {
    id: 'medium',
    label: 'Medium parcel',
    hint: 'Microwave size · up to 15 kg',
    maxKg: 15,
    multiplier: 1.28,
    handlingMin: 5,
  },
  {
    id: 'large',
    label: 'Large parcel',
    hint: 'Suitcase or carton · up to 30 kg',
    maxKg: 30,
    multiplier: 1.5,
    handlingMin: 7,
  },
];

export const sizeById = (id) => PACKAGE_SIZES.find((s) => s.id === id) || PACKAGE_SIZES[0];

/**
 * Item types feed partner capability matching (e.g. food needs an insulated bag).
 */
export const ITEM_TYPES = [
  { id: 'documents', label: 'Documents', capability: 'documents', icon: 'doc' },
  { id: 'parcel', label: 'Parcel', capability: 'parcels', icon: 'box' },
  { id: 'food', label: 'Food', capability: 'food', icon: 'food' },
  { id: 'electronics', label: 'Electronics', capability: 'electronics', icon: 'phone' },
  { id: 'clothing', label: 'Clothing', capability: 'clothing', icon: 'shirt' },
  { id: 'other', label: 'Other', capability: 'parcels', icon: 'dots' },
];

export const itemTypeById = (id) => ITEM_TYPES.find((t) => t.id === id) || ITEM_TYPES[1];

/** Quick-start tiles on the home screen. Each maps to an item type + size. */
export const QUICK_CATEGORIES = [
  { id: 'documents', label: 'Documents', icon: 'doc', itemType: 'documents', size: 'document' },
  { id: 'small', label: 'Small parcel', icon: 'box', itemType: 'parcel', size: 'small' },
  { id: 'food', label: 'Food', icon: 'food', itemType: 'food', size: 'small' },
  { id: 'electronics', label: 'Electronics', icon: 'phone', itemType: 'electronics', size: 'small' },
  { id: 'clothing', label: 'Clothing', icon: 'shirt', itemType: 'clothing', size: 'medium' },
  { id: 'other', label: 'Other', icon: 'dots', itemType: 'other', size: 'medium' },
];
