# Primavera Sound 2026 — Festival Planner App

## What this is

A personal festival planner for Primavera Sound 2026 (Barcelona, Jun 4–6).
The user wants to browse the full lineup, see set times and stages, mark artists as Must/Want/Skip,
add tags and notes, and view a personal schedule with conflict detection.

## Current state

- `lineup.json` — the raw API response from Primavera Sound's GraphQL endpoint. This is the source of truth. Do NOT pre-process it into static files — the app must load it at runtime via fetch.
- `primavera2026.html` — a working single-file prototype (Vanilla JS) built as a proof of concept. It fetches lineup.json, parses it, renders artist cards with set times/stages, priority buttons, tags, notes, and a schedule view with clash detection. Use this as the reference for features and UI, but it is NOT the target architecture.

## What needs to be built

The user wants a **proper app with readable TypeScript modules** — replace the single HTML prototype with a structured Vite + TypeScript project.

Suggested module structure:
```
src/
  types.ts          — Artist, ArtistState, Filters, etc.
  lineup.ts         — fetch + parse lineup.json into typed Artist[]
  state.ts          — localStorage persistence for user ratings/tags/notes
  filters.ts        — filter/search logic
  render/
    card.ts         — artist card HTML
    schedule.ts     — schedule view
    filters.ts      — filter chips (day, stage, priority)
  main.ts           — entry point, wires everything together
public/
  lineup.json       — symlink or copy (served statically)
```

## Data shape (from lineup.json)

The JSON has this structure:
```
{
  data: {
    getLineupEvent: {
      artists: [
        {
          artistSlugName: string,       // use as ID
          artistName: string,
          image: { en: string },        // image URL
          duration: number,             // set length in minutes
          venues: [{
            venueSlugName: string,      // stage slug
            dateTimeStartReal: string,  // Unix ms as string — REAL clock start time (use for display)
            dateTimeStartHuman: string, // Unix ms as string — festival "night" grouping (use for day assignment)
            duration: number,
          }]
        }
      ]
    }
  }
}
```

## Day assignment logic

Barcelona is UTC+2 in June. Use `dateTimeStartHuman` to determine which festival day an artist belongs to:
- Jun 3 → `wed` (pre-festival night, 3 artists at Parc del Fòrum)
- Jun 4 → `thu`
- Jun 5 → `fri`  
- Jun 6 → `sat`
- Jun 7 → `sun` (Primavera Bits — electronic/DJ day)

Sets that start after midnight still belong to the previous night (that's what `dateTimeStartHuman` encodes).

## Stage name mapping

```ts
const VENUE_NAMES: Record<string, string> = {
  'estrella-damm':        'Estrella Damm',
  'revolut':              'Revolut',
  'cupra':                'Cupra',
  'warehouse':            'Warehouse',
  'auditori-rockdelux':   'Auditori Rockdelux',
  'schwarzkopf':          'Schwarzkopf',
  'schwarzkopf-backstage':'Schwarzkopf Backstage',
  'port':                 'Port',
  'occident':             'Occident',
  'fever':                'Fever',
  'plenitude':            'Plenitude',
  'levis-501-club':       "Levi's 501 Club",
  'levis-501-plaza':      "Levi's 501 Plaza",
  'aperol-island-of-joy': 'Aperol Island of Joy',
  'pulse-cupra':          'Pulse Cupra',
  'disney-stage':         'Disney Stage',
  'barcelona-sona':       'Barcelona Sona',
  'parc-del-forum':       'Parc del Fòrum',
};
```

## Features to implement

1. **Lineup view** — artist cards grouped by day, sorted by set time. Each card shows: photo, name, time range (start–end), stage, priority buttons (Must/Want/Skip toggleable), tags (add/remove), notes textarea.
2. **Filters** — by day, by stage, by priority, free-text search (name, stage, tag).
3. **Schedule view** — only Must/Want artists, sorted by time per day, showing stage + duration. Clash detection: highlight artists whose sets overlap on the same day.
4. **Persistence** — user ratings/tags/notes saved to localStorage under key `ps26_state`.
5. **Stats** — header shows count of Must and Want picks.

## UI reference

Dark theme. See `primavera2026.html` for color tokens, card layout, and overall aesthetic. Keep it.
