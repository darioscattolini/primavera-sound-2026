import './style.css';
import { fetchLineup } from './lineup';
import { loadState, saveState, getArtistState } from './state';
import { getFilteredArtists } from './filters';
import { renderLineup } from './render/lineup';
import { renderSchedule } from './render/schedule';
import { renderStageLineup, renderStageSchedule } from './render/stageView';
import { renderModal } from './render/modal';
import { buildDayChips, buildStageChips } from './render/filters';
import { loadEnrichment } from './enrichment';
import { esc } from './utils';
import type { Artist, AppState, Filters } from './types';

let artists: Artist[] = [];
let state: AppState = loadState();
let currentTab: 'lineup' | 'schedule' = 'lineup';
let viewMode: 'time' | 'stage' = 'stage';
const filters: Filters = { day: 'all', prio: [], stage: [] };

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
  document.querySelectorAll(`[data-view="${viewMode}"]`).forEach(b => b.classList.add('active'));
  render();
});

// ── Filter accordion (mobile) ─────────────────────────────────────────────────
document.getElementById('filters-bar')!.addEventListener('click', e => {
  const btn = (e.target as Element).closest<HTMLElement>('.filter-group-btn');
  if (!btn) return;
  btn.closest('.filter-group')?.classList.toggle('open');
});

// ── Filter chips ──────────────────────────────────────────────────────────────
document.getElementById('filters-bar')!.addEventListener('click', e => {
  const chip = (e.target as Element).closest<HTMLElement>('[data-filter]');
  if (!chip) return;
  const group = chip.dataset.filter!;
  const val   = chip.dataset.val!;

  if (group === 'day') {
    // Single select
    document.querySelectorAll('[data-filter="day"]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filters.day = val;
  } else if (val === 'all') {
    // All resets multi-select
    document.querySelectorAll(`[data-filter="${group}"]`).forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    if (group === 'prio')  filters.prio  = [];
    if (group === 'stage') filters.stage = [];
  } else {
    // Multi-select toggle
    document.querySelector<HTMLElement>(`[data-filter="${group}"][data-val="all"]`)?.classList.remove('active');
    chip.classList.toggle('active');
    const selected = [...document.querySelectorAll<HTMLElement>(`[data-filter="${group}"].active`)]
      .map(c => c.dataset.val!);
    if (group === 'prio')  filters.prio  = selected;
    if (group === 'stage') filters.stage = selected;
    // Nothing selected → restore All
    if (selected.length === 0) {
      document.querySelector<HTMLElement>(`[data-filter="${group}"][data-val="all"]`)?.classList.add('active');
    }
  }

  if (currentTab === 'lineup') render();
});

// ── Stage header horizontal sync ─────────────────────────────────────────────
document.addEventListener('scroll', e => {
  const el = e.target as HTMLElement;
  if (!el.classList?.contains('sg-scroll')) return;
  const row = el.closest('.sg-outer')?.querySelector<HTMLElement>('.sg-header-row');
  if (row) row.style.transform = `translateX(-${el.scrollLeft}px)`;
}, { passive: true, capture: true });

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
  // Refresh modal priority buttons in-place
  document.querySelectorAll<HTMLElement>('[data-action="modal-set-priority"]').forEach(b => {
    b.className = b.className.replace(/active-\w+/g, '').trim();
    if (s.priority && b.dataset.value === s.priority) b.classList.add(`active-${s.priority}`);
  });
});


// ── Modal: add tag ────────────────────────────────────────────────────────────
function addTagFromInput(input: HTMLInputElement): void {
  const id  = input.dataset.id!;
  const tag = input.value.trim();
  if (!tag) return;
  const s = getArtistState(state, id);
  if (!s.tags) s.tags = [];
  if (s.tags.includes(tag)) { input.value = ''; return; }
  s.tags.push(tag);
  saveState(state);
  input.value = '';
  refreshModalTags(id, s.tags);
  updateStageBlockTags(id, s.tags);
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const input = (e.target as Element).closest<HTMLInputElement>('.modal-tag-input');
  if (input) addTagFromInput(input);
});

document.addEventListener('click', e => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-action="remove-tag"]');
  if (!btn) return;
  const { id, tag } = btn.dataset as { id: string; tag: string };
  const s = getArtistState(state, id);
  s.tags = (s.tags ?? []).filter(t => t !== tag);
  saveState(state);
  refreshModalTags(id, s.tags);
  updateStageBlockTags(id, s.tags);
});

function refreshModalTags(id: string, tags: string[]): void {
  const container = document.getElementById(`modal-tags-${id}`);
  if (!container) return;
  const input = container.querySelector<HTMLInputElement>('.modal-tag-input');
  const val = input?.value ?? '';
  container.innerHTML = tags.map(t =>
    `<span class="user-tag">${esc(t)}<button class="tag-remove" data-action="remove-tag" data-id="${id}" data-tag="${t}" aria-label="Remove">×</button></span>`
  ).join('') + `<input class="modal-tag-input" type="text" placeholder="+ tag" data-id="${id}" maxlength="32" value="${esc(val)}">`;
  container.querySelector<HTMLInputElement>('.modal-tag-input')?.focus();
}

function updateStageBlockTags(id: string, tags: string[]): void {
  document.querySelectorAll<HTMLElement>(`.sg-block[data-id="${id}"]`).forEach(block => {
    let el = block.querySelector<HTMLElement>('.sg-block-tags');
    if (tags.length === 0) { el?.remove(); return; }
    if (!el) {
      el = document.createElement('div');
      el.className = 'sg-block-tags';
      block.appendChild(el);
    }
    el.textContent = tags.join(' · ');
  });
}

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

function closestFestivalDay(): string {
  const DAY_DATE: Record<string, number> = { wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
  const bcn = new Date(Date.now() + 2 * 3_600_000);
  const todayVal = bcn.getUTCMonth() === 5 ? bcn.getUTCDate() : (bcn.getUTCMonth() < 5 ? 0 : 99);
  const order: string[] = ['wed', 'thu', 'fri', 'sat', 'sun'];
  const available = order.filter(d => artists.some(a => a.day === d));
  return available.find(d => DAY_DATE[d] >= todayVal) ?? available[available.length - 1] ?? 'thu';
}

// ── Init ──────────────────────────────────────────────────────────────────────
Promise.all([fetchLineup(), loadEnrichment()])
  .then(([data]) => {
    artists = data;
    document.querySelector('#day-filters .filter-chips')!.insertAdjacentHTML('beforeend', buildDayChips(artists));
    document.querySelector('#stage-filter-wrap .filter-chips')!.insertAdjacentHTML('beforeend', buildStageChips(artists));

    const day = closestFestivalDay();
    filters.day = day;
    document.querySelector<HTMLElement>(`[data-filter="day"][data-val="${day}"]`)?.classList.add('active');
    render();
  })
  .catch((err: Error) => {
    lineupGrid.innerHTML = `<div class="empty-state">
      <div class="big">⚠️</div>
      <div>Could not load lineup.json</div>
      <div style="margin-top:8px;font-size:0.8rem;color:#999">${esc(err.message)}</div>
    </div>`;
  });
