import type { AppState, ArtistState } from './types';

const KEY = 'ps26_state';

export function loadState(): AppState {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as AppState;
  } catch {
    return {};
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getArtistState(state: AppState, id: string): ArtistState {
  if (!state[id]) {
    state[id] = { priority: null, tags: [] };
  }
  return state[id];
}
