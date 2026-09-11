/**
 * Which muscles an exercise trains — the data behind the muscle map.
 *
 * Ported from openGym's lib/muscles.js. The exercise dataset names muscles in
 * free text and is not consistent about it: "shoulders", "deltoids" and "delts"
 * are the same thing, so are "quads" and "quadriceps", "lats" and "latissimus
 * dorsi". ALIAS collapses every spelling that occurs in the `target` and
 * `secondary` fields onto the eighteen muscles the map can actually draw.
 * Anything undrawable (hands, ankles, "cardiovascular system") maps to null and
 * is dropped rather than guessed at.
 */

/** The muscles the map can shade, head-to-toe. Also the order of any list. */
export const MUSCLES = [
  'trapezius', 'deltoids', 'chest', 'upper-back', 'serratus',
  'biceps', 'triceps', 'forearm',
  'abs', 'obliques', 'lower-back',
  'gluteal', 'quadriceps', 'hamstring', 'adductors', 'hip-flexors',
  'calves', 'tibialis',
];

/** Drawn as silhouette, never shaded: they carry no training load. */
export const INERT = ['head', 'hair', 'neck', 'hands', 'feet', 'knees', 'ankles'];

export const MUSCLE_NAME = {
  trapezius: 'Traps',
  deltoids: 'Shoulders',
  chest: 'Chest',
  'upper-back': 'Upper back',
  serratus: 'Serratus',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearm: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  'lower-back': 'Lower back',
  gluteal: 'Glutes',
  quadriceps: 'Quads',
  hamstring: 'Hamstrings',
  adductors: 'Adductors',
  'hip-flexors': 'Hip flexors',
  calves: 'Calves',
  tibialis: 'Shins',
};

/** Every spelling that occurs in the dataset. null = not drawable. */
const ALIAS = {
  // primaries
  abs: 'abs', pectorals: 'chest', biceps: 'biceps', glutes: 'gluteal', delts: 'deltoids',
  triceps: 'triceps', 'upper back': 'upper-back', lats: 'upper-back', calves: 'calves',
  quads: 'quadriceps', forearms: 'forearm', hamstrings: 'hamstring', spine: 'lower-back',
  traps: 'trapezius', adductors: 'adductors', 'serratus anterior': 'serratus',
  abductors: 'gluteal', 'levator scapulae': 'trapezius', 'cardiovascular system': null,
  // secondaries
  shoulders: 'deltoids', deltoids: 'deltoids', 'rear deltoids': 'deltoids',
  'rotator cuff': 'deltoids', quadriceps: 'quadriceps', core: 'abs', abdominals: 'abs',
  'lower abs': 'abs', chest: 'chest', 'upper chest': 'chest', 'hip flexors': 'hip-flexors',
  obliques: 'obliques', 'lower back': 'lower-back', rhomboids: 'upper-back',
  trapezius: 'trapezius', back: 'upper-back', 'latissimus dorsi': 'upper-back',
  brachialis: 'biceps', soleus: 'calves', shins: 'tibialis', wrists: 'forearm',
  'wrist flexors': 'forearm', 'wrist extensors': 'forearm', 'grip muscles': 'forearm',
  groin: 'adductors', 'inner thighs': 'adductors',
  ankles: null, feet: null, hands: null, 'ankle stabilizers': null,
  sternocleidomastoid: null,
};

/**
 * Fallback when nothing in an entry resolves. Weights inside a group sum to 1,
 * so "upper legs" spreads over three muscles rather than counting triple.
 */
const BY_BODYPART = {
  chest: { chest: 1 },
  back: { 'upper-back': 0.75, 'lower-back': 0.25 },
  shoulders: { deltoids: 1 },
  'upper arms': { biceps: 0.5, triceps: 0.5 },
  'lower arms': { forearm: 1 },
  waist: { abs: 0.7, obliques: 0.3 },
  'upper legs': { quadriceps: 0.4, hamstring: 0.35, gluteal: 0.25 },
  'lower legs': { calves: 0.8, tibialis: 0.2 },
  neck: { trapezius: 1 },
  cardio: {},
};

/** A supporting muscle counts this much against a primary. */
const SECONDARY = 0.4;

/** Muscles one exercise trains: { slug: 0…1 }. */
export function musclesOf(exercise) {
  if (!exercise) return {};
  const out = {};
  const add = (name, weight) => {
    const slug = ALIAS[String(name || '').toLowerCase().trim()];
    if (slug) out[slug] = Math.max(out[slug] || 0, weight);
  };

  add(exercise.target, 1);
  (exercise.secondary || []).forEach((m) => add(m, SECONDARY));

  if (!Object.keys(out).length) {
    Object.assign(out, BY_BODYPART[exercise.bodyPart] || {});
  }
  return out;
}

/** True when this exercise trains the given muscle at all. */
export function trains(exercise, slug) {
  if (!slug) return true;
  return Boolean(musclesOf(exercise)[slug]);
}

/** True when the muscle is the exercise's primary target. */
export function isPrimary(exercise, slug) {
  return musclesOf(exercise)[slug] === 1;
}

/**
 * How much each muscle is represented across a list of exercises, in the same
 * weighted units musclesOf uses. Drives the map shading.
 */
export function coverageOf(exercises) {
  const load = {};
  (exercises || []).forEach((exercise) => {
    const m = musclesOf(exercise);
    for (const slug in m) load[slug] = (load[slug] || 0) + m[slug];
  });
  return load;
}

/** How many exercises in the list train each muscle. Drives the readouts. */
export function countsOf(exercises) {
  const counts = {};
  (exercises || []).forEach((exercise) => {
    Object.keys(musclesOf(exercise)).forEach((slug) => {
      counts[slug] = (counts[slug] || 0) + 1;
    });
  });
  return counts;
}

/**
 * Shade buckets 0–4 per muscle, relative to the heaviest muscle in the same
 * set. Relative on purpose: the map answers "where is this group concentrated",
 * which only means anything as a comparison within one selection.
 */
export function levelsOf(load) {
  const max = Math.max(0, ...MUSCLES.map((m) => load[m] || 0));
  const levels = {};
  MUSCLES.forEach((m) => {
    const v = load[m] || 0;
    levels[m] = !v || max <= 0 ? 0 : Math.max(1, Math.min(4, Math.ceil((v / max) * 4)));
  });
  return levels;
}

/** Muscles present in a coverage map, heaviest first. */
export function rankOf(load) {
  return MUSCLES.filter((m) => (load[m] || 0) > 0).sort((a, b) => load[b] - load[a]);
}
