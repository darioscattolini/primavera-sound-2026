export interface Video {
  id: string;
  title: string;
}

export interface ArtistEnrichment {
  genres: string[];
  videos: Video[];
}

// Placeholder — same data for every artist until enrichment.json is built
const PLACEHOLDER: ArtistEnrichment = {
  genres: ['Indie Rock', 'Shoegaze', 'Dream Pop'],
  videos: [
    { id: 'NUnvdUDWHBU', title: 'Karma Police'       },
    { id: 'u5CVsCnxyXg', title: 'Fake Plastic Trees'  },
    { id: 'XFkzRNyygfk', title: 'High and Dry'        },
    { id: 'yI2oS2hoL0k', title: 'Burn the Witch'      },
  ],
};

export function getEnrichment(_artistId: string): ArtistEnrichment {
  return PLACEHOLDER;
}
