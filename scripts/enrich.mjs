// Usage:
//   Single artist:  node --env-file=.env scripts/enrich.mjs <slug>
//   All artists:    node --env-file=.env scripts/enrich.mjs --all

import https from 'https';
import fs    from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const LASTFM_KEY  = process.env.LASTFM_KEY;
const YOUTUBE_KEY = process.env.YOUTUBE_KEY;

const __dirname       = dirname(fileURLToPath(import.meta.url));
const ARTISTS_FILE    = join(__dirname, '../public/data/artists.json');
const ENRICHMENT_FILE = join(__dirname, '../public/data/enrichment.json');

// ── HTTP helper ───────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse failed: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── YouTube quota guard ───────────────────────────────────────────────────────
function checkQuota(data) {
  if (data?.error?.errors?.[0]?.reason === 'quotaExceeded') {
    console.error('\n\nYouTube quota exceeded. Progress saved — run again tomorrow.');
    process.exit(0);
  }
  return data;
}

// ── Last.fm: all genre tags ───────────────────────────────────────────────────
async function getGenres(artistName) {
  const data = await get(
    `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo`
    + `&artist=${encodeURIComponent(artistName)}`
    + `&api_key=${LASTFM_KEY}&format=json`
  );
  if (data.error || !data.artist?.tags?.tag) return [];
  const tags = data.artist.tags.tag;
  return (Array.isArray(tags) ? tags : [tags]).map(t => t.name);
}

// ── YouTube: Topic channel search + single video call ────────────────────────
async function getChannelId(artistName) {
  const nameLower = artistName.toLowerCase();
  const data = checkQuota(await get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=5`
    + `&q=${encodeURIComponent(artistName + ' - Topic')}&key=${YOUTUBE_KEY}`
  ));

  // 1. Exact "Artist - Topic" match (YouTube's auto-generated music channel)
  const topic = (data.items || []).find(
    c => c.snippet.title.toLowerCase() === `${nameLower} - topic`
  );
  if (topic) return topic.id.channelId;

  // 2. Channel whose title exactly equals or starts with the artist name
  const nameMatch = (data.items || []).find(c => {
    const title = c.snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const artist = nameLower.replace(/[^a-z0-9]/g, '');
    return title === artist || title === artist + 'official';
  });
  return nameMatch?.id.channelId ?? null;
}

async function getVideos(artistName) {
  const channelId = await getChannelId(artistName);
  console.log(`  channel: ${channelId ?? 'not found'}`);

  // Single call: 8 results by view count — split into classics/recent client-side
  const q = channelId
    ? `channelId=${channelId}`
    : `q=${encodeURIComponent('"' + artistName + '" official')}&videoCategoryId=10`;

  const data = checkQuota(await get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&maxResults=8`
    + `&${q}&key=${YOUTUBE_KEY}`
  ));

  const items = (data.items || []).map(v => ({
    id:          v.id.videoId,
    title:       v.snippet.title,
    publishedAt: v.snippet.publishedAt,
  }));

  const classics = items.slice(0, 2).map(({ id, title }) => ({ id, title }));
  const classicIds = new Set(classics.map(v => v.id));
  const recent = items
    .filter(v => !classicIds.has(v.id))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 2)
    .map(({ id, title }) => ({ id, title }));

  return { classics, recent };
}

// ── Enrich one artist ─────────────────────────────────────────────────────────
async function enrichArtist(slug, name, existing) {
  const needsGenres = !existing?.genres?.length;
  const needsVideos = !existing?.classics?.length && !existing?.recent?.length;
  const [genres, videos] = await Promise.all([
    needsGenres ? getGenres(name) : Promise.resolve(existing.genres),
    needsVideos ? getVideos(name) : Promise.resolve({ classics: existing.classics ?? [], recent: existing.recent ?? [] }),
  ]);
  return { genres, ...videos };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const artists = JSON.parse(fs.readFileSync(ARTISTS_FILE, 'utf8'));
  const arg     = process.argv[2];

  if (!arg) {
    console.error('Usage: node --env-file=.env scripts/enrich.mjs <slug>  OR  --all');
    process.exit(1);
  }

  if (arg === '--all') {
    const out = fs.existsSync(ENRICHMENT_FILE)
      ? JSON.parse(fs.readFileSync(ENRICHMENT_FILE, 'utf8'))
      : {};

    for (const { slug, name } of artists) {
      const e = out[slug];
      const complete = e?.genres?.length && (e?.classics?.length || e?.recent?.length);
      if (complete) { process.stdout.write('.'); continue; }
      try {
        const result = await enrichArtist(slug, name, e);
        const merged = {
          genres:   result.genres.length   ? result.genres   : (e?.genres   ?? []),
          classics: result.classics.length ? result.classics : (e?.classics ?? []),
          recent:   result.recent.length   ? result.recent   : (e?.recent   ?? []),
        };
        const hasData = merged.genres.length || merged.classics.length || merged.recent.length;
        if (!hasData) { process.stdout.write(`\n- ${name} (empty)`); continue; }
        out[slug] = merged;
        process.stdout.write(`\n✓ ${name}`);
        fs.writeFileSync(ENRICHMENT_FILE, JSON.stringify(out, null, 2));
      } catch (err) {
        process.stdout.write(`\n✗ ${name}: ${err.message}`);
      }
      await sleep(300);
    }
    console.log('\n\nDone.');

  } else {
    const artist = artists.find(a => a.slug === arg);
    if (!artist) { console.error(`Slug "${arg}" not found`); process.exit(1); }

    console.log(`Fetching: ${artist.name}\n`);
    const result = await enrichArtist(artist.slug, artist.name);
    console.log(JSON.stringify({ [artist.slug]: result }, null, 2));

    const out = fs.existsSync(ENRICHMENT_FILE)
      ? JSON.parse(fs.readFileSync(ENRICHMENT_FILE, 'utf8'))
      : {};
    const e = out[artist.slug];
    out[artist.slug] = {
      genres:   result.genres.length   ? result.genres   : (e?.genres   ?? []),
      classics: result.classics.length ? result.classics : (e?.classics ?? []),
      recent:   result.recent.length   ? result.recent   : (e?.recent   ?? []),
    };
    fs.writeFileSync(ENRICHMENT_FILE, JSON.stringify(out, null, 2));
    console.log(`\nSaved to ${ENRICHMENT_FILE}`);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
