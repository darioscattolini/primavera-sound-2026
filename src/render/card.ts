import type { Artist, AppState } from '../types';
import { getArtistState } from '../state';
import { esc, addMinutes } from '../utils';
import { DAY_META } from '../constants';

export function renderCard(artist: Artist, state: AppState): string {
  const s = getArtistState(state, artist.id);
  const prio = s.priority ?? '';
  const prioClass = prio ? `priority-${prio}` : '';
  const endTime = addMinutes(artist.time, artist.duration);
  const dayLabel = DAY_META[artist.day]?.label ?? artist.day;

  const imgHtml = artist.image
    ? `<img class="card-img" src="${artist.image}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : '';

  return `<div class="artist-card day-${artist.day} ${prioClass}" id="card-${artist.id}">
    ${imgHtml}
    <div class="card-body">
      <div class="card-top">
        <div class="artist-name">${esc(artist.name)}</div>
        <span class="day-badge">${dayLabel}</span>
      </div>
      <div class="card-meta">
        <span class="time">${artist.time}–${endTime}</span>
        <span class="stage">${esc(artist.stage)}</span>
      </div>
      <div class="priority-btns">
        <button class="prio-btn ${prio === 'must' ? 'active-must' : ''}" data-action="set-priority" data-id="${artist.id}" data-value="must">🔥 Must</button>
        <button class="prio-btn ${prio === 'want' ? 'active-want' : ''}" data-action="set-priority" data-id="${artist.id}" data-value="want">⭐ Want</button>
        <button class="prio-btn ${prio === 'skip' ? 'active-skip' : ''}" data-action="set-priority" data-id="${artist.id}" data-value="skip">👋 Skip</button>
      </div>
      <div class="tags-area">
        <div class="tag-list" id="tags-${artist.id}">${renderTagList(artist.id, s.tags)}</div>
        <div class="tag-input-row">
          <input class="tag-input" id="taginput-${artist.id}" data-tag-input="${artist.id}" placeholder="add tag…" maxlength="20">
          <button class="tag-add-btn" data-action="add-tag" data-id="${artist.id}">+</button>
        </div>
      </div>
      <textarea class="notes-input" rows="1" placeholder="notes…"
        data-action="set-notes" data-id="${artist.id}"
        onfocus="this.rows=3" onblur="this.rows=1"
      >${esc(s.notes)}</textarea>
    </div>
  </div>`;
}

export function renderTagList(artistId: string, tags: string[]): string {
  return tags.map(t =>
    `<span class="tag" data-action="remove-tag" data-id="${artistId}" data-tag="${esc(t)}">
      ${esc(t)} <span class="remove">×</span>
    </span>`
  ).join('');
}
