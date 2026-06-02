import type { Artist, AppState } from '../types';
import { getArtistState } from '../state';
import { esc, addMinutes } from '../utils';
import { DAY_META } from '../constants';
import { getEnrichment } from '../enrichment';

const PRIO_ICON: Record<string, string> = {
  must: '🔥', want: '⭐', maybe: '🤔', skip: '👋',
};

export function renderCard(artist: Artist, state: AppState): string {
  const s = getArtistState(state, artist.id);
  const prio = s.priority ?? '';
  const endTime = addMinutes(artist.time, artist.duration);
  const dayLabel = DAY_META[artist.day]?.label ?? artist.day;
  const { genres } = getEnrichment(artist.id);

  const imgHtml = artist.image
    ? `<img class="card-img" src="${artist.image}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : '';

  const genreChips = genres.map(g => `<span class="genre-chip">${esc(g)}</span>`).join('');
  const prioIcon = prio ? `<span class="card-prio-icon">${PRIO_ICON[prio]}</span>` : '';

  return `<div class="artist-card day-${artist.day}${prio ? ` priority-${prio}` : ''}"
    id="card-${artist.id}" data-action="open-modal" data-id="${artist.id}">
    ${imgHtml}
    <div class="card-body">
      <div class="card-top">
        <div class="artist-name">${esc(artist.name)}</div>
        ${prioIcon}
      </div>
      <div class="card-meta">
        <span class="time">${artist.time}–${endTime}</span>
        <span class="stage">${esc(artist.stage)}</span>
        <span class="day-badge">${dayLabel}</span>
      </div>
      <div class="card-genres">${genreChips}</div>
    </div>
  </div>`;
}
