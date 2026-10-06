/**
 * Workout generation.
 *
 * Builds a session from the local catalogue. Each split declares an ordered
 * list of muscle slots; every slot is filled by an exercise that trains that
 * muscle as its primary target, compounds first so the heavy work lands while
 * the lifter is fresh.
 *
 * Deterministic for a given seed, so a workout can be regenerated or shared.
 */

import { MUSCLE_NAME, musclesOf } from './muscles';

/* ---------- splits ---------- */

/**
 * `slots` is the priority order of muscles to fill. A session that asks for
 * fewer exercises than there are slots takes the first N, so the most
 * important work for that split always survives the trim.
 */
export const SPLITS = {
  push: {
    label: 'Push',
    blurb: 'Chest, shoulders, triceps',
    slots: ['chest', 'deltoids', 'triceps', 'chest', 'deltoids', 'triceps', 'chest', 'triceps'],
  },
  pull: {
    label: 'Pull',
    blurb: 'Back, biceps, rear delts',
    slots: ['upper-back', 'biceps', 'upper-back', 'trapezius', 'biceps', 'lower-back', 'upper-back', 'forearm'],
  },
  legs: {
    label: 'Legs',
    blurb: 'Quads, hamstrings, glutes, calves',
    slots: ['quadriceps', 'hamstring', 'gluteal', 'quadriceps', 'hamstring', 'calves', 'adductors', 'calves'],
  },
  upper: {
    label: 'Upper',
    blurb: 'Everything above the waist',
    slots: ['chest', 'upper-back', 'deltoids', 'biceps', 'triceps', 'upper-back', 'chest', 'forearm'],
  },
  lower: {
    label: 'Lower',
    blurb: 'Legs and midsection',
    slots: ['quadriceps', 'hamstring', 'gluteal', 'calves', 'abs', 'quadriceps', 'hamstring', 'obliques'],
  },
  full: {
    label: 'Full body',
    blurb: 'One session, head to toe',
    slots: ['quadriceps', 'chest', 'upper-back', 'deltoids', 'hamstring', 'abs', 'biceps', 'triceps'],
  },
  core: {
    label: 'Core',
    blurb: 'Abs, obliques, lower back',
    slots: ['abs', 'obliques', 'lower-back', 'abs', 'obliques', 'abs', 'hip-flexors', 'lower-back'],
  },
  arms: {
    label: 'Arms',
    blurb: 'Biceps, triceps, forearms',
    slots: ['biceps', 'triceps', 'biceps', 'triceps', 'forearm', 'biceps', 'triceps', 'forearm'],
  },
};

/* ---------- equipment ---------- */

export const KITS = {
  full: { label: 'Full gym', match: null },
  home: {
    label: 'Home kit',
    match: ['body weight', 'dumbbell', 'band', 'resistance band', 'kettlebell', 'stability ball', 'medicine ball'],
  },
  dumbbell: { label: 'Dumbbells', match: ['dumbbell', 'body weight'] },
  bodyweight: { label: 'Bodyweight', match: ['body weight'] },
};

/* ---------- goals ---------- */

/** Sets, rep range and rest differ by goal and by whether a lift is compound. */
export const GOALS = {
  strength: {
    label: 'Strength',
    compound: { sets: 5, reps: '3–5', rest: '2–3 min' },
    isolation: { sets: 3, reps: '6–8', rest: '90 sec' },
  },
  hypertrophy: {
    label: 'Hypertrophy',
    compound: { sets: 4, reps: '6–10', rest: '90 sec' },
    isolation: { sets: 3, reps: '10–15', rest: '60 sec' },
  },
  endurance: {
    label: 'Endurance',
    compound: { sets: 3, reps: '15–20', rest: '45 sec' },
    isolation: { sets: 3, reps: '15–20', rest: '30 sec' },
  },
};

export const LENGTHS = {
  quick: { label: 'Quick', count: 4, minutes: 30 },
  standard: { label: 'Standard', count: 6, minutes: 45 },
  long: { label: 'Long', count: 8, minutes: 60 },
};

/* ---------- helpers ---------- */

/**
 * Small deterministic PRNG so a seed always rebuilds the same session.
 * Seeds arrive as 1, 2, 3... from the shuffle button, and consecutive small
 * seeds produce correlated first outputs, so the seed is hashed before use -
 * otherwise shuffling changes only the tail of the workout.
 */
function rng(seed) {
  let s = Math.imul(seed >>> 0 || 1, 2654435761) >>> 0;
  const step = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  step(); step(); step();   // discard the correlated opening values
  return step;
}

/* The catalogue mixes training movements with stretches and mobility drills.
   Programming a stretch for 5 sets of 3 is nonsense, so they are excluded. */
const NOT_TRAINING = /\b(stretch|yoga|pose)\b/i;

/* Compound vs isolation is a movement-pattern question, not a muscle-count
   one: counting muscles marks almost everything compound, because most
   entries list two or more secondaries. */
const COMPOUND_RX =
  /\b(press|squat|deadlift|row|pull[- ]?up|chin[- ]?up|dip|lunge|thrust|clean|snatch|push[- ]?up|pulldown|step[- ]?up|good morning|carry)\b/i;
const ISOLATION_RX =
  /\b(curl|extension|raise|fly|flye|kickback|crunch|pushdown|shrug|pullover|pec deck|calf|lateral)\b/i;

/** Equipment a typical lifter actually reaches for. */
const MAINSTREAM = ['barbell', 'dumbbell', 'cable', 'body weight', 'leverage machine', 'kettlebell', 'ez barbell', 'smith machine'];

/** A recognised movement pattern in the name. */
const MOVEMENT_RX =
  /\b(bench press|squat|deadlift|row|pull[- ]?up|chin[- ]?up|dip|lunge|press|curl|pulldown|extension|raise|fly|pushdown|thrust|crunch|calf raise|good morning|hyperextension|shrug)\b/i;

/** Catalogue entries that lead with their kit are the canonical ones. */
const KIT_PREFIX_RX = /^(barbell|dumbbell|cable|lever|smith|ez[- ]barbell|kettlebell)\b/i;

/* Two movement words in one name means a novelty combo - "dumbbell biceps
   curl squat", "cable pulldown bicep curl". They score like staples because
   every keyword hits, so they need an explicit penalty. */
const MOVEMENT_RX_G = new RegExp(MOVEMENT_RX.source, 'gi');

export function isTrainingMovement(exercise) {
  return !NOT_TRAINING.test(exercise.name || '');
}

/** Multi-joint movements earn the heavy sets and the early slots. */
export function isCompound(exercise) {
  const name = exercise.name || '';
  if (ISOLATION_RX.test(name) && !COMPOUND_RX.test(name)) return false;
  if (COMPOUND_RX.test(name)) return true;
  return (exercise.secondary || []).length >= 2;
}

function fitsKit(exercise, kit) {
  const match = KITS[kit] ? KITS[kit].match : null;
  if (!match) return true;
  return match.includes(exercise.equipment);
}

/**
 * Candidates are ranked, not shuffled. The catalogue holds dozens of variants
 * per muscle, most of them obscure, so an even draw produces sessions full of
 * archer push-ups and stalder presses. Mainstream kit and short canonical
 * names score highest; the pick is then random within the top slice, which
 * keeps variety without surfacing the long tail.
 */
function scoreOf(exercise) {
  const name = exercise.name || '';
  const words = name.split(/\s+/).length;
  let score = 0;
  if (MAINSTREAM.includes(exercise.equipment)) score += 3;
  if (MOVEMENT_RX.test(name)) score += 4;
  if (KIT_PREFIX_RX.test(name)) score += 2;
  // One-word entries are catalogue stubs ("quads"), not exercises.
  if (words < 2) score -= 5;
  // Long names are niche variants of something simpler
  // ("dumbbell bicep curl lunge with bowling motion").
  if (words > 4) score -= (words - 4) * 1.5;
  // Parenthetical qualifiers and "v. 2" mark secondary catalogue entries.
  if (/[(]|\bv\.\s*\d/.test(name)) score -= 2;
  const moves = name.match(MOVEMENT_RX_G);
  if (moves && moves.length >= 2) score -= 4;
  return score;
}

const SHORTLIST = 8;

/** Exercises whose primary target is this muscle, best candidates first. */
function candidatesFor(catalogue, slug, kit) {
  return catalogue
    .filter((e) => musclesOf(e)[slug] === 1 && fitsKit(e, kit) && isTrainingMovement(e))
    .sort((a, b) => scoreOf(b) - scoreOf(a));
}

/* ---------- generation ---------- */

/**
 * @param {Array} catalogue normalised exercises
 * @param {{split:string, kit:string, goal:string, length:string, seed:number}} opts
 * @returns {{exercises:Array, meta:Object, missing:Array}}
 */
export function buildWorkout(catalogue, opts) {
  const { split = 'push', kit = 'full', goal = 'hypertrophy', length = 'standard' } = opts || {};
  const seed = opts && opts.seed ? opts.seed : 1;
  const plan = SPLITS[split] || SPLITS.push;
  const want = (LENGTHS[length] || LENGTHS.standard).count;
  const scheme = GOALS[goal] || GOALS.hypertrophy;
  const rand = rng(seed);

  const used = new Set();
  const picked = [];
  const missing = [];

  // Roughly the first half of the session is multi-joint work, so the heavy
  // lifts happen while the lifter is fresh and the isolation work finishes
  // the muscle off. Filling purely by "compounds first" produces a session of
  // six presses and no accessory work at all.
  const compoundTarget = Math.max(2, Math.round(want / 2));

  const take = (slug, wantCompound) => {
    const pool = candidatesFor(catalogue, slug, kit).filter((e) => !used.has(e.id));
    if (!pool.length) return false;
    // Prefer the requested kind, but take anything rather than leave a gap.
    let sub = pool.filter((e) => isCompound(e) === wantCompound);
    if (!sub.length) sub = pool;
    // Some muscles have no real compound - biceps, calves, abs. Forcing one
    // produces hybrids like "dumbbell bicep curl lunge with bowling motion".
    // If the best compound is far worse than the best exercise available,
    // take the good isolation movement instead.
    else if (wantCompound && scoreOf(sub[0]) < scoreOf(pool[0]) - 2) sub = pool;
    const shortlist = sub.slice(0, SHORTLIST);
    const choice = shortlist[Math.floor(rand() * shortlist.length)];
    used.add(choice.id);
    picked.push({ exercise: choice, slot: slug });
    return true;
  };

  for (const slug of plan.slots) {
    if (picked.length >= want) break;
    if (!take(slug, picked.length < compoundTarget) && !missing.includes(slug)) {
      missing.push(slug);
    }
  }

  // A short session means some slot ran dry under this kit; walk the slots
  // again so the count is honoured even if the muscle split skews.
  if (picked.length < want) {
    for (const slug of plan.slots) {
      if (picked.length >= want) break;
      take(slug, false);
    }
  }

  const exercises = picked.map(({ exercise, slot }, i) => {
    const compound = isCompound(exercise);
    const s = compound ? scheme.compound : scheme.isolation;
    return {
      order: i + 1,
      exercise,
      slot,
      slotName: MUSCLE_NAME[slot] || slot,
      compound,
      sets: s.sets,
      reps: s.reps,
      rest: s.rest,
    };
  });

  // Muscles the session actually covers, which is not the same as the slots:
  // a compound fills one slot but trains several.
  const covered = new Set();
  exercises.forEach(({ exercise }) => {
    Object.keys(musclesOf(exercise)).forEach((m) => covered.add(m));
  });

  return {
    exercises,
    missing: missing.filter((m) => !covered.has(m)),
    meta: {
      split,
      splitLabel: plan.label,
      blurb: plan.blurb,
      kit,
      kitLabel: (KITS[kit] || KITS.full).label,
      goal,
      goalLabel: scheme.label,
      length,
      minutes: (LENGTHS[length] || LENGTHS.standard).minutes,
      totalSets: exercises.reduce((n, e) => n + e.sets, 0),
      covered: [...covered],
      seed,
    },
  };
}

/** Plain-text version, for the clipboard and for the coach's context. */
export function workoutToText(workout) {
  const { meta, exercises } = workout;
  const head = `${meta.splitLabel.toUpperCase()} — ${meta.goalLabel}, ${meta.kitLabel}, ~${meta.minutes} min`;
  const body = exercises
    .map(
      (e) =>
        `${String(e.order).padStart(2, '0')}. ${e.exercise.name} — ${e.sets} × ${e.reps} (rest ${e.rest})`
    )
    .join('\n');
  return `${head}\n\n${body}\n\n${meta.totalSets} working sets total.`;
}
