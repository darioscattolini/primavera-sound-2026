import type { Day } from './types';

export const DAY_ORDER: Day[] = ['wed', 'thu', 'fri', 'sat', 'sun'];

// Preferred stage column order (slugs). Unknown stages append alphabetically at the end.
export const STAGE_ORDER: string[] = [
  'estrella-damm',
  'revolut',
  'plenitude',
  'adidas',
  'aperol-island-of-joy',
  'disney-stage',
  'barcelona-sona',
  'cupra',
  'pulse-cupra',
  'port',
  'schwarzkopf',
  'warehouse',
  'levis-501-club',
  'schwarzkopf-backstage',
  'levis-501-plaza',
  'occident',
  'auditori-rockdelux',
];

export interface DayMeta {
  label: string;
  full: string;
  color: string;
  emoji: string;
}

export const DAY_META: Record<Day, DayMeta> = {
  wed: { label: 'Wed 3', full: 'Wednesday, June 3',                color: '#4a1d6b', emoji: '💜' },
  thu: { label: 'Thu 4', full: 'Thursday, June 4',                 color: '#7c3aed', emoji: '💜' },
  fri: { label: 'Fri 5', full: 'Friday, June 5',                   color: '#0891b2', emoji: '💙' },
  sat: { label: 'Sat 6', full: 'Saturday, June 6',                 color: '#059669', emoji: '💚' },
  sun: { label: 'Sun 7', full: 'Sunday, June 7 · Primavera Bits',  color: '#db2777', emoji: '🩷' },
  tbd: { label: 'TBD',   full: 'TBD',                              color: '#888888', emoji: '' },
};
