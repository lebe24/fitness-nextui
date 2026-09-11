/**
 * YouTube Data API v3 — technique-video search.
 * Set REACT_APP_YOUTUBE_API_KEY in .env.local; see .env.example.
 */

const KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export const MISSING_KEY_MESSAGE =
  'No YouTube API key found. Copy .env.example to .env.local, add your key, and restart the dev server.';

/**
 * @param {string} query free-text search term
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{id:string,title:string,channel:string,publishedAt:string,thumbnail:string}>>}
 */
export async function searchVideos(query, signal) {
  const term = (query || '').trim();
  if (!term) return [];
  if (!KEY) throw new Error(MISSING_KEY_MESSAGE);

  const params = new URLSearchParams({
    part: 'snippet',
    maxResults: '24',
    q: `${term} workout`,
    type: 'video',
    key: KEY,
  });

  const res = await fetch(`${SEARCH_URL}?${params}`, { signal });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(
      (detail && detail.error && detail.error.message) ||
        `YouTube responded ${res.status}`
    );
  }

  const data = await res.json();
  return (data.items || [])
    .filter((item) => item.id && item.id.videoId)
    .map((item) => ({
      id: item.id.videoId,
      title: decodeEntities(item.snippet.title),
      channel: decodeEntities(item.snippet.channelTitle),
      publishedAt: item.snippet.publishedAt,
      thumbnail:
        (item.snippet.thumbnails.high || item.snippet.thumbnails.medium || {}).url,
    }));
}

/** YouTube returns titles with HTML entities such as &amp; and &#39;. */
function decodeEntities(text) {
  if (!text) return '';
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}
