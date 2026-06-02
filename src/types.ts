export type Priority = 'must' | 'want' | 'maybe' | 'skip' | null;
export type Day = 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'tbd';

export interface Artist {
  id: string;
  name: string;
  day: Day;
  stage: string;
  stageSlug: string;
  time: string;
  timeTs: number;
  duration: number;
  image: string;
}

export interface ArtistState {
  priority: Priority;
}

export interface AppState {
  [artistId: string]: ArtistState;
}

export interface Filters {
  day: string;
  prio: string;
  stage: string;
  search: string;
}
