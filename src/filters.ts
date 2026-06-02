import type { Artist, AppState, Filters } from './types';
import { getArtistState } from './state';

export function getFilteredArtists(artists: Artist[], state: AppState, filters: Filters): Artist[] {
  return artists.filter(a => {
    const s = getArtistState(state, a.id);
    if (filters.day !== 'all' && a.day !== filters.day) return false;
    if (filters.stage.length > 0 && !filters.stage.includes(a.stageSlug)) return false;
    if (filters.prio.length > 0) {
      const p = s.priority ?? 'none';
      if (!filters.prio.includes(p)) return false;
    }
    return true;
  });
}
