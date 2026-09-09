// Single source of truth for trade categories and Incoterms.
// Used by marketplace facets, listing forms, and seed data — one home per business rule.
// NOTE: these values must match existing DB records (seed.js); do not rename without a migration.
export const CATEGORIES = [
  'Spices',
  'Beverages',
  'Textiles',
  'Food',
  'Eco-Friendly',
  'Fashion',
  'Tech',
  'Other',
];

export const INCOTERMS = ['FOB', 'CIF', 'EXW', 'DDP'];
