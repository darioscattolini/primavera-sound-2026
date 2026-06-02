import type { Artist } from '../types';
import { DAY_META, DAY_ORDER, STAGE_ORDER } from '../constants';
import { esc } from '../utils';

export function buildDayChips(artists: Artist[]): string {
  const presentDays = DAY_ORDER.filter(d => artists.some(a => a.day === d));
  return presentDays.map(d => {
    const m = DAY_META[d];
    return `<div class="chip day-${d}" data-filter="day" data-val="${d}">${m.label}</div>`;
  }).join('');
}

export function buildStageChips(artists: Artist[]): string {
  const seen = new Set<string>();
  const stages: { slug: string; name: string }[] = [];
  artists.forEach(a => {
    if (!seen.has(a.stageSlug)) {
      seen.add(a.stageSlug);
      stages.push({ slug: a.stageSlug, name: a.stage });
    }
  });
  stages.sort((a, b) => {
    const ai = STAGE_ORDER.indexOf(a.slug);
    const bi = STAGE_ORDER.indexOf(b.slug);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return stages.map(({ slug, name }) =>
    `<div class="chip" data-filter="stage" data-val="${slug}">${esc(name)}</div>`
  ).join('');
}
