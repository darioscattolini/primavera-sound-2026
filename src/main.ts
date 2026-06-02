import './style.css';
import { fetchLineup } from './lineup';
import { loadState, saveState, getArtistState } from './state';
import { getFilteredArtists } from './filters';
import { renderLineup } from './render/lineup';
import { renderSchedule } from './render/schedule';
import { renderStageLineup, renderStageSchedule } from './render/stageView';
import { renderTagList } from './render/card';
import { buildDayChips, buildStageChips } from './render/filters';
import { esc } from './utils';
import type { Artist, AppState, Filters } from './types';

let artists: Artist[] = [];
let state: AppState = loadState();
let currentTab: 'lineup' | 'schedule' = 'lineup';
let viewMode: 'time' | 'stage' = 'time';
const filters: Filters = { day: 'all', prio: 'all', stage: 'all', search: '' };

const lineupView   = document.getElementById('lineup-view')!;
const scheduleView = document.getElementById('schedule-view')!;
const lineupGrid   = document.getElementById('lineup-grid')!;
const scheduleContent = document.getElementById('schedule-content')!;

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
  let must = 0, want = 0;
  for (const a of artists) {
    const p = getArtistState(state, a.id).priority;
    if (p === 'must') must++;
    else if (p === 'want') want++;
  }
  document.getElementById('stat-must')!.textContent = String(must);
  document.getElementById('stat-want')!.textContent = String(want);
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

// ── View toggle ───────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-view]');
  if (!btn) return;
  viewMode = btn.dataset.view as 'time' | 'stage';
  document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
});

// ── Search ────────────────────────────────────────────────────────────────────
document.getElementById('search-input')!.addEventListener('input', e => {
  filters.search = (e.target as HTMLInputElement).value;
  render();
});

// ── Card actions (event delegation on lineup-grid) ────────────────────────────
lineupGrid.addEventListener('click', e => {
  const el = (e.target as Element).closest<HTMLElement>('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  if (!action || !id) return;

  if (action === 'set-priority') {
    const value = el.dataset.value as 'must' | 'want' | 'skip';
    const s = getArtistState(state, id);
    s.priority = s.priority === value ? null : value;
    saveState(state);
    updateCardDOM(id, s.priority);
    updateStats();
  }

  if (action === 'remove-tag') {
    const tag = el.dataset.tag!;
    const s = getArtistState(state, id);
    s.tags = s.tags.filter(t => t !== tag);
    saveState(state);
    const tagEl = document.getElementById(`tags-${id}`);
    if (tagEl) tagEl.innerHTML = renderTagList(id, s.tags);
  }

  if (action === 'add-tag') addTag(id);

  if (action === 'sg-cycle') {
    const s = getArtistState(state, id);
    const cycle = [null, 'must', 'want', 'skip', null] as const;
    const idx = cycle.indexOf(s.priority);
    s.priority = cycle[idx + 1] ?? null;
    saveState(state);
    // Update block in-place: class + icon
    document.querySelectorAll<HTMLElement>(`[data-action="sg-cycle"][data-id="${id}"]`).forEach(block => {
      block.className = `sg-block${s.priority ? ` sg-${s.priority}` : ''}`;
      const nameEl = block.querySelector<HTMLElement>('.sg-block-name');
      if (nameEl) {
        const icon = s.priority === 'must' ? '🔥 ' : s.priority === 'want' ? '⭐ ' : '';
        nameEl.textContent = icon + (artists.find(a => a.id === id)?.name ?? '');
      }
    });
    updateStats();
  }
});

lineupGrid.addEventListener('keydown', e => {
  const target = e.target as HTMLElement;
  if (target.dataset.tagInput && (e as KeyboardEvent).key === 'Enter') {
    e.preventDefault();
    addTag(target.dataset.tagInput);
  }
});

lineupGrid.addEventListener('change', e => {
  const target = e.target as HTMLElement;
  if (target.dataset.action === 'set-notes' && target.dataset.id) {
    getArtistState(state, target.dataset.id).notes = (target as HTMLTextAreaElement).value;
    saveState(state);
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function addTag(id: string): void {
  const input = document.getElementById(`taginput-${id}`) as HTMLInputElement | null;
  if (!input) return;
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  const s = getArtistState(state, id);
  if (!s.tags.includes(val)) {
    s.tags = [...s.tags, val];
    saveState(state);
    const tagEl = document.getElementById(`tags-${id}`);
    if (tagEl) tagEl.innerHTML = renderTagList(id, s.tags);
  }
  input.value = '';
}

function updateCardDOM(id: string, priority: string | null): void {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  card.className = card.className.replace(/priority-\w+/g, '').trim();
  if (priority) card.classList.add(`priority-${priority}`);
  card.querySelectorAll<HTMLElement>('.prio-btn').forEach(btn => {
    btn.className = btn.className.replace(/active-\w+/g, '').trim();
    if (priority && btn.dataset.value === priority) btn.classList.add(`active-${priority}`);
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
      <div style="margin-top:8px;font-size:0.8rem;color:#555">${esc(err.message)}</div>
    </div>`;
  });
