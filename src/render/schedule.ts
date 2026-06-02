import type { Artist, AppState } from '../types';
import { getArtistState } from '../state';
import { esc, addMinutes } from '../utils';
import { DAY_META, DAY_ORDER } from '../constants';

export function renderSchedule(artists: Artist[], state: AppState): string {
  const myArtists = artists
    .filter(a => {
      const p = getArtistState(state, a.id).priority;
      return p === 'must' || p === 'want' || p === 'maybe';
    })
    .sort((a, b) => a.timeTs - b.timeTs);

  if (myArtists.length === 0) {
    return `<div class="empty-state">
      <div class="big">📋</div>
      <div>No artists marked yet.</div>
      <div style="margin-top:8px;font-size:0.85rem">Go to Lineup and mark artists as 🔥 Must or ⭐ Want.</div>
    </div>`;
  }

  const conflicts = detectConflicts(myArtists);
  const byDay: Partial<Record<string, Artist[]>> = {};
  myArtists.forEach(a => { (byDay[a.day] ??= []).push(a); });

  let html = '';
  for (const day of DAY_ORDER) {
    const group = byDay[day];
    if (!group) continue;
    const m = DAY_META[day];

    html += `<div class="schedule-day">
      <div class="schedule-day-title">
        <span style="color:${m.color}">${m.emoji}</span>
        ${m.full}
        <span class="count-badge">${group.length}</span>
      </div>
      <div class="schedule-list">`;

    for (const a of group) {
      const s = getArtistState(state, a.id);
      const icon = s.priority === 'must' ? '🔥' : s.priority === 'want' ? '⭐' : '🤔';
      const tagsHtml = s.tags.map(t => `<span class="sched-tag">${esc(t)}</span>`).join('');
      const notesHtml = s.notes ? `<div class="sched-notes">"${esc(s.notes)}"</div>` : '';
      const conflictBadge = conflicts.has(a.id) ? `<span class="conflict-badge">⚡ clash</span>` : '';
      const endTime = addMinutes(a.time, a.duration);

      html += `<div class="schedule-item ${s.priority ?? ''}">
        <div class="sched-time">${a.time}</div>
        <div class="sched-prio-icon">${icon}</div>
        <div style="flex:1;min-width:0">
          <div class="sched-name">${esc(a.name)}${conflictBadge}</div>
          <div class="sched-meta">${esc(a.stage)} · ${a.duration} min · ends ${endTime}</div>
          ${tagsHtml ? `<div class="sched-tags">${tagsHtml}</div>` : ''}
          ${notesHtml}
        </div>
      </div>`;
    }

    html += `</div></div>`;
  }

  return html;
}

function detectConflicts(artists: Artist[]): Set<string> {
  const conflicts = new Set<string>();
  for (let i = 0; i < artists.length; i++) {
    for (let j = i + 1; j < artists.length; j++) {
      const a = artists[i], b = artists[j];
      if (a.day !== b.day) continue;
      const aEnd = a.timeTs + a.duration * 60_000;
      const bEnd = b.timeTs + b.duration * 60_000;
      if (a.timeTs < bEnd && b.timeTs < aEnd) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
    }
  }
  return conflicts;
}
