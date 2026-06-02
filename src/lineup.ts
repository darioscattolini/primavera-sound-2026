import type { Artist, Day } from './types';

const VENUE_NAMES: Record<string, string> = {
  'estrella-damm':         'Estrella Damm',
  'revolut':               'Revolut',
  'cupra':                 'Cupra',
  'warehouse':             "Levi's Warehouse",
  'auditori-rockdelux':    'Auditori Rockdelux',
  'schwarzkopf':           'Schwarzkopf',
  'schwarzkopf-backstage': 'Backstage by Schwarzkopf',
  'port':                  'Port',
  'occident':              'Occident',
  'fever':                 'Fever House',
  'plenitude':             'Plenitude',
  'levis-501-club':        '501 Club',
  'levis-501-plaza':       "Levi's Plaza",
  'aperol-island-of-joy':  'Aperol Island of Joy',
  'pulse-cupra':           'Cupra Pulse',
  'disney-stage':          'Disney',
  'barcelona-sona':        'Barcelona Sona',
  'parc-del-forum':        'Parc del Fòrum',
  'adidas':                'The Adidas Yard',
};

interface RawVenue {
  venueSlugName: string;
  dateTimeStartReal: string;
  dateTimeStartHuman: string;
  duration: number;
}

interface RawArtist {
  artistSlugName: string;
  artistName: string;
  image: { en: string } | null;
  duration: number;
  venues: RawVenue[];
}

interface RawLineup {
  data: { getLineupEvent: { artists: RawArtist[] } };
}

function tsToBarcelonaTime(ms: number): string {
  const d = new Date(ms + 2 * 3600 * 1000);
  return d.getUTCHours().toString().padStart(2, '0') + ':' + d.getUTCMinutes().toString().padStart(2, '0');
}

function humanTsToDay(humanMs: number, realMs: number): Day {
  const ms = humanMs || realMs;
  const date = new Date(ms + 2 * 3600 * 1000).getUTCDate();
  const map: Record<number, Day> = { 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 7: 'sun' };
  return map[date] ?? 'tbd';
}

function processLineup(raw: RawLineup): Artist[] {
  return raw.data.getLineupEvent.artists
    .filter(a => a.venues.length > 0)
    .map(a => {
      const v = a.venues[0];
      const realTs = parseInt(v.dateTimeStartReal, 10);
      const humanTs = parseInt(v.dateTimeStartHuman, 10);
      return {
        id:        a.artistSlugName,
        name:      a.artistName,
        day:       humanTsToDay(humanTs, realTs),
        stage:     VENUE_NAMES[v.venueSlugName] ?? v.venueSlugName,
        stageSlug: v.venueSlugName,
        time:      tsToBarcelonaTime(realTs),
        timeTs:    realTs,
        duration:  v.duration,
        image:     a.image?.en ?? '',
      };
    })
    .sort((a, b) => a.timeTs - b.timeTs);
}

const GQL_URL = 'https://graphql.primaverasound.com/prod/graphql';
const GQL_QUERY = `
  query Get($name: String!) {
    getLineupEvent(name: $name) {
      artists {
        artistSlugName
        artistName
        image { en }
        duration
        venues {
          venueSlugName
          dateTimeStartReal
          dateTimeStartHuman
          duration
        }
      }
    }
  }
`;

export async function fetchLineup(): Promise<Artist[]> {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GQL_QUERY,
      operationName: 'Get',
      variables: { name: 'primavera-sound-2026-barcelona' },
    }),
  });
  const raw: RawLineup = await res.json();
  return processLineup(raw);
}
