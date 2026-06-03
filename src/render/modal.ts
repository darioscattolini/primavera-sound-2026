import type { Artist, AppState } from '../types';
import { getArtistState } from '../state';
import { esc, addMinutes } from '../utils';
import { DAY_META } from '../constants';
import { getEnrichment } from '../enrichment';

export function renderModal(artist: Artist, state: AppState): string {
  const s = getArtistState(state, artist.id);
  const prio = s.priority ?? '';
  const endTime = addMinutes(artist.time, artist.duration);
  const m = DAY_META[artist.day];
  const { genres, videos } = getEnrichment(artist.id);

  const genreChips = genres.map(g => `<span class="genre-chip">${esc(g)}</span>`).join('');

  const priorityBtns = (['must', 'want', 'maybe', 'skip'] as const).map(p => {
    const labels: Record<string, string> = { must: '🔥 Must', want: '⭐ Want', maybe: '🤔 Maybe', skip: '👋 Skip' };
    return `<button class="prio-btn${prio === p ? ` active-${p}` : ''}"
      data-action="modal-set-priority" data-id="${artist.id}" data-value="${p}">
      ${labels[p]}
    </button>`;
  }).join('');

  const imgHtml = artist.image
    ? `<img class="modal-img" src="${artist.image}" alt="" onerror="this.style.display='none'">`
    : '';

  const videoCards = videos.map(v => `
    <a class="video-thumb" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">
      <div class="video-thumb-img" style="background-image:url(https://img.youtube.com/vi/${v.id}/mqdefault.jpg)">
        <div class="video-play-btn">▶</div>
      </div>
      <div class="video-thumb-title">${esc(v.title)}</div>
    </a>
  `).join('');

  return `<div class="modal-overlay" id="modal-overlay">
    <div class="modal" id="modal-box">
      <button class="modal-close" data-action="close-modal" aria-label="Close">×</button>

      <div class="modal-header">
        ${imgHtml}
        <div class="modal-info">
          <div class="modal-name">${esc(artist.name)}</div>
          <div class="modal-meta">
            <div style="color:${m.color}">${m.emoji} ${m.full}</div>
            <div>${esc(artist.stage)}</div>
            <div><strong>${artist.time}–${endTime}</strong> · ${artist.duration} min</div>
          </div>
          <div class="modal-genres">${genreChips}</div>
        </div>
      </div>

      <div class="priority-btns modal-priority-btns">${priorityBtns}</div>

      <div class="modal-links">
        <a class="modal-link" href="https://www.primaverasound.com/en/artist/${artist.id}?e=primavera-sound-2026-barcelona" target="_blank" rel="noopener noreferrer">
          Primavera Sound
        </a>
        <a class="modal-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name)}" target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
      </div>

      <div class="video-grid">${videoCards}</div>
    </div>
  </div>`;
}
