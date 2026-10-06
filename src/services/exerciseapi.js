/**
 * Exercise catalogue.
 *
 * Ported from openGym's approach: the movement data ships with the app as a
 * static JSON file and the media is pulled from a version-pinned CDN copy of
 * the upstream dataset rather than bundled. That removes the RapidAPI
 * dependency (and its key) entirely.
 *
 * Data and media: https://github.com/hasaneyldrm/exercises-dataset
 * Review that project's terms before redistributing the media yourself.
 */

const PINNED = '7455efae41b330c265e7cd4b78dfa848e7ce5ebd';
const CDN = `https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@${PINNED}`;

// Point these at your own host to serve the media locally instead.
const IMG_BASE = process.env.REACT_APP_IMG_BASE || `${CDN}/images/`;
const GIF_BASE = process.env.REACT_APP_GIF_BASE || `${CDN}/videos/`;

const CATALOGUE_URL = `${process.env.PUBLIC_URL || ''}/exercises.json`;

/**
 * Upstream records are terse: n=name, bp=body part, tg=target, eq=equipment,
 * mg=main muscle, sm=secondary muscles, st=step-by-step instructions.
 */
function normalise(record) {
  return {
    id: record.id,
    name: record.n,
    bodyPart: record.bp,
    target: record.tg,
    equipment: record.eq,
    mainMuscle: record.mg,
    secondary: record.sm || [],
    instructions: record.st || [],
    imgUrl: record.img ? IMG_BASE + record.img : null,
    gifUrl: record.gif ? GIF_BASE + record.gif : null,
  };
}

let cataloguePromise = null;

/**
 * Fetched once per session, then reused. Deliberately not tied to any caller's
 * AbortSignal: several consumers share this one request, so one of them
 * unmounting must not cancel it for the rest.
 */
function fetchCatalogue() {
  if (!cataloguePromise) {
    cataloguePromise = fetch(CATALOGUE_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Catalogue responded ${res.status}`);
        return res.json();
      })
      .then((rows) => rows.map(normalise))
      .catch((err) => {
        // Don't cache a rejection, or every later call inherits it.
        cataloguePromise = null;
        throw err;
      });
  }
  return cataloguePromise;
}

/** Each consumer checks its own signal once the shared load settles. */
async function loadCatalogue(signal) {
  const all = await fetchCatalogue();
  if (signal && signal.aborted) {
    const err = new Error('Aborted');
    err.name = 'AbortError';
    throw err;
  }
  return all;
}

/** The body-part groups present in the catalogue, alphabetically. */
export async function fetchBodyParts(signal) {
  const all = await loadCatalogue(signal);
  return [...new Set(all.map((e) => e.bodyPart))].sort();
}

/** How many movements the catalogue holds, for the masthead readout. */
export async function fetchCatalogueCount(signal) {
  const all = await loadCatalogue(signal);
  return all.length;
}

/** The whole catalogue, for the workout builder. */
export async function fetchAllExercises(signal) {
  return loadCatalogue(signal);
}

/** Every exercise filed under a given body part. */
export async function fetchExercisesByBodyPart(bodyPart, signal) {
  const all = await loadCatalogue(signal);
  const part = bodyPart || 'back';
  return all.filter((e) => e.bodyPart === part);
}
