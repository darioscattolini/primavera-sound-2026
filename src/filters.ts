import type { Artist, AppState, Filters } from './types';
import { getArtistState } from './state';

export function getFilteredArtists(artists: Artist[], state: AppState, filters: Filters): Artist[] {
  const q = filters.search.toLowerCase().trim();
  return artists.filter(a => {
    const s = getArtistState(state, a.id);
    if (filters.day !== 'all' && a.day !== filters.day) return false;
    if (filters.stage !== 'all' && a.stageSlug !== filters.stage) return false;
    if (filters.prio !== 'all') {
      const p = s.priority ?? 'none';
      if (p !== filters.prio) return false;
    }
    if (q) {
      const stageMatch = a.stage.toLowerCase().includes(q);
      if (!a.name.toLowerCase().includes(q) && !stageMatch) return false;
    }
    return true;
  });
}
