import type { Artist, AppState } from '../types';
import { DAY_META, DAY_ORDER } from '../constants';
import { renderCard } from './card';

export function renderLineup(artists: Artist[], state: AppState): string {
  const byDay: Partial<Record<string, Artist[]>> = {};
  artists.forEach(a => {
    (byDay[a.day] ??= []).push(a);
  });

  let html = '';
  for (const day of DAY_ORDER) {
    const group = byDay[day];
    if (!group || group.length === 0) continue;
    const m = DAY_META[day];
    html += `<div class="day-section">
      <div class="day-header">
        <div class="day-dot" style="background:${m.color}"></div>
        <h2>${m.emoji} ${m.full}</h2>
        <span class="day-count">${group.length} artist${group.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="artists-grid">
        ${group.map(a => renderCard(a, state)).join('')}
      </div>
    </div>`;
  }

  return html || `<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`;
}
