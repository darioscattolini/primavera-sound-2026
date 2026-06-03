import type { Artist, AppState } from '../types';
import { getArtistState } from '../state';
import { esc, addMinutes } from '../utils';
import { DAY_META, DAY_ORDER, STAGE_ORDER } from '../constants';

const PX_PER_MIN = 1.5;
const GUTTER_W = 48;
const CW = 120;
const HOUR_MS = 3_600_000;

function firstDayGrid(artists: Artist[], state: AppState): string {
  const byDay: Partial<Record<string, Artist[]>> = {};
  artists.forEach(a => { (byDay[a.day] ??= []).push(a); });
  for (const day of DAY_ORDER) {
    const group = byDay[day];
    if (group?.length) return renderDayGrid(day, group, state);
  }
  return `<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`;
}

export function renderStageLineup(artists: Artist[], state: AppState): string {
  return firstDayGrid(artists, state);
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

  return firstDayGrid(myArtists, state);
}

function renderDayGrid(day: string, artists: Artist[], state: AppState): string {
  const m = DAY_META[day as keyof typeof DAY_META];

  // Unique stages sorted alphabetically
  const stageMap = new Map<string, string>();
  artists.forEach(a => { if (!stageMap.has(a.stageSlug)) stageMap.set(a.stageSlug, a.stage); });
  const stages = [...stageMap.entries()].sort((a, b) => {
    const ai = STAGE_ORDER.indexOf(a[0]);
    const bi = STAGE_ORDER.indexOf(b[0]);
    if (ai === -1 && bi === -1) return a[1].localeCompare(b[1]);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  // Time bounds — round to hour boundaries
  const minTs = Math.min(...artists.map(a => a.timeTs));
  const maxTs = Math.max(...artists.map(a => a.timeTs + a.duration * 60_000));
  const startTs = Math.floor(minTs / HOUR_MS) * HOUR_MS;
  const endTs   = Math.ceil(maxTs / HOUR_MS) * HOUR_MS;
  const PAD = 12;
  const gridHeight = (endTs - startTs) / 60_000 * PX_PER_MIN + PAD * 2;

  // Hour ticks + horizontal grid lines
  const ticks: string[] = [];
  const hlines: string[] = [];
  for (let ts = startTs; ts <= endTs; ts += HOUR_MS) {
    const top = PAD + (ts - startTs) / 60_000 * PX_PER_MIN;
    const d = new Date(ts + 2 * 3_600_000);
    const label = `${String(d.getUTCHours()).padStart(2, '0')}:00`;
    ticks.push(`<div class="sg-tick" style="top:${top}px">${label}</div>`);
    hlines.push(`<div class="sg-hline" style="top:${top}px"></div>`);
  }

  // Column headers
  const headers = stages.map(([, name]) =>
    `<div class="sg-col-header" style="width:${CW}px">${esc(name)}</div>`
  ).join('');

  // Artist blocks per column
  const cols = stages.map(([slug]) => {
    const blocks = artists
      .filter(a => a.stageSlug === slug)
      .map(a => {
        const s = getArtistState(state, a.id);
        const prio = s.priority ?? '';
        const top    = PAD + (a.timeTs - startTs) / 60_000 * PX_PER_MIN;
        const height = Math.max(a.duration * PX_PER_MIN, 28);
        const endTime = addMinutes(a.time, a.duration);
        const icon = prio === 'must' ? '🔥 ' : prio === 'want' ? '⭐ ' : prio === 'maybe' ? '🤔 ' : '';
        const tags = (s.tags ?? []).join(' · ');
        return `<div class="sg-block${prio ? ` sg-${prio}` : ''}"
          style="top:${top}px;height:${height}px"
          data-action="open-modal" data-id="${a.id}">
          <div class="sg-block-name">${icon}${esc(a.name)}</div>
          <div class="sg-block-time">${a.time}–${endTime}</div>
          ${tags ? `<div class="sg-block-tags">${esc(tags)}</div>` : ''}
        </div>`;
      }).join('');
    return `<div class="sg-col" style="width:${CW}px">${blocks}</div>`;
  }).join('');

  const gridWidth = stages.length * (CW + 1) + GUTTER_W;

  return `<div class="sg-outer">
    <div class="sg-header-sticky">
      <div class="sg-header-row" style="padding-left:${GUTTER_W}px;min-width:${gridWidth}px">${headers}</div>
    </div>
    <div class="sg-scroll">
      <div style="min-width:${gridWidth}px">
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
