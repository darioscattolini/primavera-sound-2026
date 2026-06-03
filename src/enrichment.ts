export interface Video {
  id: string;
  title: string;
}

export interface ArtistEnrichment {
  genres: string[];
  videos: Video[];
}

interface RawEntry {
  genres: string[];
  classics?: Video[];
  recent?: Video[];
  videos?: Video[];
}

let data: Record<string, RawEntry> = {};

export async function loadEnrichment(): Promise<void> {
  try {
    data = await fetch('data/enrichment.json').then(r => r.json());
  } catch {
    data = {};
  }
}

const PLACEHOLDER: ArtistEnrichment = {
  genres: ['Indie Rock', 'Shoegaze', 'Dream Pop'],
  videos: [
    { id: 'NUnvdUDWHBU', title: 'Karma Police'       },
    { id: 'u5CVsCnxyXg', title: 'Fake Plastic Trees'  },
    { id: 'XFkzRNyygfk', title: 'High and Dry'        },
    { id: 'yI2oS2hoL0k', title: 'Burn the Witch'      },
  ],
};

export function getEnrichment(artistId: string): ArtistEnrichment {
  const e = data[artistId];
  if (!e) return PLACEHOLDER;
  return {
    genres: e.genres ?? [],
    videos: [...(e.classics ?? []), ...(e.recent ?? []), ...(e.videos ?? [])],
  };
}
