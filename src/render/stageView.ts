import type { Artist, AppState } from '../types';
import { getArtistState } from '../state';
import { esc, addMinutes } from '../utils';
import { DAY_META, DAY_ORDER } from '../constants';
import { getEnrichment } from '../enrichment';

const PX_PER_MIN = 1.5;
export const COL_WIDTH = 160;
const GUTTER_W = 48;
const HOUR_MS = 3_600_000;

export function renderStageLineup(artists: Artist[], state: AppState): string {
  const byDay: Partial<Record<string, Artist[]>> = {};
  artists.forEach(a => { (byDay[a.day] ??= []).push(a); });

  let html = '';
  for (const day of DAY_ORDER) {
    const group = byDay[day];
    if (!group?.length) continue;
    html += renderDayGrid(day, group, state);
  }
  return html || `<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`;
}

export function renderStageSchedule(artists: Artist[], state: AppState): string {
  const myArtists = artists.filter(a => {
    const p = getArtistState(state, a.id).priority;
    return p === 'must' || p === 'want' || p === 'maybe';
  });

  if (!myArtists.length) {
    return `<div class="empty-state">
      <div class="big">📋</div><div>No artists marked yet.</div>
      <div style="margin-top:8px;font-size:0.85rem">Mark artists as 🔥 Must or ⭐ Want in the Lineup.</div>
    </div>`;
  }

  const byDay: Partial<Record<string, Artist[]>> = {};
  myArtists.forEach(a => { (byDay[a.day] ??= []).push(a); });

  let html = '';
  for (const day of DAY_ORDER) {
    const group = byDay[day];
    if (!group?.length) continue;
    html += renderDayGrid(day, group, state);
  }
  return html;
}

function renderDayGrid(day: string, artists: Artist[], state: AppState): string {
  const m = DAY_META[day as keyof typeof DAY_META];

  // Unique stages sorted alphabetically
  const stageMap = new Map<string, string>();
  artists.forEach(a => { if (!stageMap.has(a.stageSlug)) stageMap.set(a.stageSlug, a.stage); });
  const stages = [...stageMap.entries()].sort((a, b) => a[1].localeCompare(b[1]));

  // Time bounds — round to hour boundaries
  const minTs = Math.min(...artists.map(a => a.timeTs));
  const maxTs = Math.max(...artists.map(a => a.timeTs + a.duration * 60_000));
  const startTs = Math.floor(minTs / HOUR_MS) * HOUR_MS;
  const endTs   = Math.ceil(maxTs / HOUR_MS) * HOUR_MS;
  const gridHeight = (endTs - startTs) / 60_000 * PX_PER_MIN;

  // Hour ticks + horizontal grid lines
  const ticks: string[] = [];
  const hlines: string[] = [];
  for (let ts = startTs; ts <= endTs; ts += HOUR_MS) {
    const top = (ts - startTs) / 60_000 * PX_PER_MIN;
    const d = new Date(ts + 2 * 3_600_000);
    const label = `${String(d.getUTCHours()).padStart(2, '0')}:00`;
    ticks.push(`<div class="sg-tick" style="top:${top}px">${label}</div>`);
    hlines.push(`<div class="sg-hline" style="top:${top}px"></div>`);
  }

  // Column headers
  const headers = stages.map(([, name]) =>
    `<div class="sg-col-header" style="width:${COL_WIDTH}px">${esc(name)}</div>`
  ).join('');

  // Artist blocks per column
  const cols = stages.map(([slug]) => {
    const blocks = artists
      .filter(a => a.stageSlug === slug)
      .map(a => {
        const s = getArtistState(state, a.id);
        const prio = s.priority ?? '';
        const top    = (a.timeTs - startTs) / 60_000 * PX_PER_MIN;
        const height = Math.max(a.duration * PX_PER_MIN, 28);
        const endTime = addMinutes(a.time, a.duration);
        const icon = prio === 'must' ? '🔥 ' : prio === 'want' ? '⭐ ' : prio === 'maybe' ? '🤔 ' : '';
        const { genres } = getEnrichment(a.id);
        const genreLine = genres.slice(0, 2).map(g => `<span class="sg-genre">${esc(g)}</span>`).join('');
        return `<div class="sg-block${prio ? ` sg-${prio}` : ''}"
          style="top:${top}px;height:${height}px"
          data-action="open-modal" data-id="${a.id}"
          title="${esc(a.name)} · ${a.time}–${endTime}">
          <div class="sg-block-name">${icon}${esc(a.name)}</div>
          <div class="sg-block-time">${a.time}–${endTime}</div>
          <div class="sg-block-genres">${genreLine}</div>
        </div>`;
      }).join('');
    return `<div class="sg-col" style="width:${COL_WIDTH}px">${blocks}</div>`;
  }).join('');

  const gridWidth = stages.length * (COL_WIDTH + 1) + GUTTER_W;

  return `<div class="day-section">
    <div class="day-header">
      <div class="day-dot" style="background:${m.color}"></div>
      <h2>${m.emoji} ${m.full}</h2>
      <span class="day-count">${artists.length} artist${artists.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="sg-scroll">
      <div style="min-width:${gridWidth}px">
        <div class="sg-header-row" style="padding-left:${GUTTER_W}px">${headers}</div>
        <div class="sg-body" style="height:${gridHeight}px">
          <div class="sg-ruler">${ticks.join('')}</div>
          <div class="sg-cols-area">
            <div class="sg-hlines">${hlines.join('')}</div>
            ${cols}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
