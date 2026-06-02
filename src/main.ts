import './style.css';
import { fetchLineup } from './lineup';
import { loadState, saveState, getArtistState } from './state';
import { getFilteredArtists } from './filters';
import { renderLineup } from './render/lineup';
import { renderSchedule } from './render/schedule';
import { renderStageLineup, renderStageSchedule } from './render/stageView';
import { renderModal } from './render/modal';
import { buildDayChips, buildStageChips } from './render/filters';
import { esc } from './utils';
import type { Artist, AppState, Filters } from './types';

let artists: Artist[] = [];
let state: AppState = loadState();
let currentTab: 'lineup' | 'schedule' = 'lineup';
let viewMode: 'time' | 'stage' = 'time';
const filters: Filters = { day: 'all', prio: 'all', stage: 'all', search: '' };

const lineupView      = document.getElementById('lineup-view')!;
const scheduleView    = document.getElementById('schedule-view')!;
const lineupGrid      = document.getElementById('lineup-grid')!;
const scheduleContent = document.getElementById('schedule-content')!;
const modalContainer  = document.getElementById('modal-container')!;

// ── Render ────────────────────────────────────────────────────────────────────
function render(): void {
  if (currentTab === 'lineup') {
    const filtered = getFilteredArtists(artists, state, filters);
    lineupGrid.innerHTML = viewMode === 'stage'
      ? renderStageLineup(filtered, state)
      : renderLineup(filtered, state);
  } else {
    scheduleContent.innerHTML = viewMode === 'stage'
      ? renderStageSchedule(artists, state)
      : renderSchedule(artists, state);
  }
  updateStats();
}

function updateStats(): void {
  let must = 0, want = 0, maybe = 0;
  for (const a of artists) {
    const p = getArtistState(state, a.id).priority;
    if (p === 'must') must++;
    else if (p === 'want') want++;
    else if (p === 'maybe') maybe++;
  }
  document.getElementById('stat-must')!.textContent  = String(must);
  document.getElementById('stat-want')!.textContent  = String(want);
  document.getElementById('stat-maybe')!.textContent = String(maybe);
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const tab = (e.target as Element).closest<HTMLElement>('[data-tab]');
  if (!tab) return;
  currentTab = tab.dataset.tab as 'lineup' | 'schedule';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  lineupView.style.display   = currentTab === 'lineup'   ? '' : 'none';
  scheduleView.style.display = currentTab === 'schedule' ? 'block' : 'none';
  render();
});

// ── View toggle ───────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-view]');
  if (!btn) return;
  viewMode = btn.dataset.view as 'time' | 'stage';
  document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
});

// ── Filter chips ──────────────────────────────────────────────────────────────
document.getElementById('filters-bar')!.addEventListener('click', e => {
  const chip = (e.target as Element).closest<HTMLElement>('[data-filter]');
  if (!chip) return;
  const group = chip.dataset.filter!;
  const val   = chip.dataset.val!;
  document.querySelectorAll(`[data-filter="${group}"]`).forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  if (group === 'day')   filters.day   = val;
  if (group === 'prio')  filters.prio  = val;
  if (group === 'stage') filters.stage = val;
  if (currentTab === 'lineup') render();
});

// ── Search ────────────────────────────────────────────────────────────────────
document.getElementById('search-input')!.addEventListener('input', e => {
  filters.search = (e.target as HTMLInputElement).value;
  render();
});

// ── Modal: open ───────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const el = (e.target as Element).closest<HTMLElement>('[data-action="open-modal"]');
  if (!el) return;
  const artist = artists.find(a => a.id === el.dataset.id);
  if (!artist) return;
  modalContainer.innerHTML = renderModal(artist, state);
  document.body.style.overflow = 'hidden';
});

// ── Modal: close ──────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const target = e.target as Element;
  if (
    target.id === 'modal-overlay' ||
    target.closest('[data-action="close-modal"]')
  ) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function closeModal(): void {
  modalContainer.innerHTML = '';
  document.body.style.overflow = '';
}

// ── Modal: priority change ────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-action="modal-set-priority"]');
  if (!btn) return;
  const { id, value } = btn.dataset as { id: string; value: string };
  const s = getArtistState(state, id);
  s.priority = s.priority === value ? null : value as typeof s.priority;
  saveState(state);
  updateArtistDOM(id, s.priority);
  updateStats();
  // Refresh modal priority buttons in-place
  document.querySelectorAll<HTMLElement>('[data-action="modal-set-priority"]').forEach(b => {
    b.className = b.className.replace(/active-\w+/g, '').trim();
    if (s.priority && b.dataset.value === s.priority) b.classList.add(`active-${s.priority}`);
  });
});


// ── Helpers ───────────────────────────────────────────────────────────────────
function updateArtistDOM(id: string, priority: string | null): void {
  // Grid card
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.className = card.className.replace(/priority-\w+/g, '').trim();
    if (priority) card.classList.add(`priority-${priority}`);
    const icon = card.querySelector<HTMLElement>('.card-prio-icon');
    const icons: Record<string, string> = { must: '🔥', want: '⭐', maybe: '🤔', skip: '👋' };
    if (icon) icon.textContent = priority ? (icons[priority] ?? '') : '';
  }
  // Stage blocks
  document.querySelectorAll<HTMLElement>(`.sg-block[data-id="${id}"]`).forEach(block => {
    block.className = `sg-block${priority ? ` sg-${priority}` : ''}`;
    const nameEl = block.querySelector<HTMLElement>('.sg-block-name');
    if (nameEl) {
      const icons: Record<string, string> = { must: '🔥 ', want: '⭐ ', maybe: '🤔 ' };
      const artistName = artists.find(a => a.id === id)?.name ?? '';
      nameEl.textContent = (priority && icons[priority] ? icons[priority] : '') + artistName;
    }
  });
  // Schedule items
  document.querySelectorAll<HTMLElement>(`.schedule-item[data-id="${id}"]`).forEach(item => {
    item.className = item.className.replace(/\b(must|want|maybe|skip)\b/g, '').trim();
    if (priority) item.classList.add(priority);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
fetchLineup()
  .then(data => {
    artists = data;
    document.getElementById('day-filters')!.insertAdjacentHTML('beforeend', buildDayChips(artists));
    document.getElementById('stage-filter-wrap')!.insertAdjacentHTML('beforeend', buildStageChips(artists));
    render();
  })
  .catch((err: Error) => {
    lineupGrid.innerHTML = `<div class="empty-state">
      <div class="big">⚠️</div>
      <div>Could not load lineup.json</div>
      <div style="margin-top:8px;font-size:0.8rem;color:#999">${esc(err.message)}</div>
    </div>`;
  });
