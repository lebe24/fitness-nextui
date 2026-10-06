/**
 * Renders a workout to a 1080x1350 PNG, the Instagram portrait size.
 *
 * Drawn on a canvas rather than built with a screenshot library: no
 * dependency, and the exercise art is served with Access-Control-Allow-Origin,
 * so loading it with crossOrigin="anonymous" keeps the canvas exportable.
 */

const W = 1080;
const H = 1350;
const PAD = 72;

const INK = '#0b0b0c';
const PANEL = '#121214';
const BONE = '#f2efe9';
const BONE_MUTE = '#75736e';
const VOLT = '#d8ff3d';
const RULE = 'rgba(242,239,233,0.16)';

const DISPLAY = '"Big Shoulders Display", "Oswald", "Arial Narrow", sans-serif';
const MONO = '"Chivo Mono", ui-monospace, Menlo, monospace';
const BODY = '"Chivo", Helvetica, Arial, sans-serif';

/** Web fonts must be in before the first fillText or the canvas falls back. */
async function waitForFonts() {
  if (!document.fonts) return;
  try {
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load('900 100px "Big Shoulders Display"'),
      document.fonts.load('700 24px "Chivo Mono"'),
      document.fonts.load('400 26px "Chivo"'),
    ]);
  } catch {
    /* fall back to the stack above */
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function tracked(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
  return cursor;
}

/** Shrink the font until the string fits, rather than clipping it. */
function fitText(ctx, text, max, weight, family, start, min) {
  let size = start;
  for (;;) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= max || size <= min) return size;
    size -= 2;
  }
}

/**
 * @param {object} workout from buildWorkout
 * @returns {Promise<string>} a PNG data URL
 */
export async function renderWorkoutCard(workout) {
  const { meta, exercises } = workout;
  await waitForFonts();

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  // Faint column rules, the same structural grid the site uses.
  ctx.strokeStyle = 'rgba(242,239,233,0.05)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo((W / 4) * i, 0);
    ctx.lineTo((W / 4) * i, H);
    ctx.stroke();
  }

  /* ---------- masthead ---------- */
  ctx.fillStyle = VOLT;
  ctx.fillRect(PAD, PAD, 46, 46);
  ctx.fillStyle = INK;
  ctx.font = `900 30px ${DISPLAY}`;
  ctx.fillText('II', PAD + 10, PAD + 34);

  ctx.fillStyle = BONE;
  ctx.font = `800 32px ${DISPLAY}`;
  ctx.fillText('IRON INDEX', PAD + 62, PAD + 24);
  ctx.fillStyle = BONE_MUTE;
  ctx.font = `500 14px ${MONO}`;
  tracked(ctx, 'IRONINDEX.FIT', PAD + 62, PAD + 44, 2.2);

  /* ---------- title ---------- */
  const title = `${meta.splitLabel.toUpperCase()} DAY`;
  const titleSize = fitText(ctx, title, W - PAD * 2, 900, DISPLAY, 150, 80);
  ctx.fillStyle = BONE;
  ctx.font = `900 ${titleSize}px ${DISPLAY}`;
  ctx.fillText(title, PAD, PAD + 200);

  ctx.fillStyle = VOLT;
  ctx.font = `500 19px ${MONO}`;
  tracked(
    ctx,
    `${meta.goalLabel.toUpperCase()}  •  ${meta.kitLabel.toUpperCase()}  •  ~${meta.minutes} MIN`,
    PAD,
    PAD + 240,
    1.6
  );

  ctx.strokeStyle = RULE;
  ctx.beginPath();
  ctx.moveTo(PAD, PAD + 274);
  ctx.lineTo(W - PAD, PAD + 274);
  ctx.stroke();

  /* ---------- exercise rows ---------- */
  const top = PAD + 300;
  const bottom = H - PAD - 96;
  const rowH = Math.min(132, (bottom - top) / Math.max(exercises.length, 1));
  const thumb = Math.min(92, rowH - 22);

  const images = await Promise.all(exercises.map((e) => loadImage(e.exercise.imgUrl)));

  exercises.forEach((item, i) => {
    const y = top + rowH * i;

    ctx.fillStyle = PANEL;
    ctx.fillRect(PAD, y, W - PAD * 2, rowH - 10);

    // Exercise still, on a bone plate so the white-background art sits right.
    const img = images[i];
    if (img) {
      ctx.fillStyle = BONE;
      ctx.fillRect(PAD + 12, y + 11, thumb, thumb);
      ctx.drawImage(img, PAD + 12, y + 11, thumb, thumb);
    }

    const textX = PAD + 12 + (img ? thumb + 22 : 10);

    ctx.fillStyle = VOLT;
    ctx.font = `700 16px ${MONO}`;
    ctx.fillText(String(item.order).padStart(2, '0'), textX, y + 32);

    const nameMax = W - PAD - textX - 190;
    const name = item.exercise.name.toUpperCase();
    const nameSize = fitText(ctx, name, nameMax, 800, DISPLAY, 40, 22);
    ctx.fillStyle = BONE;
    ctx.font = `800 ${nameSize}px ${DISPLAY}`;
    ctx.fillText(name, textX + 34, y + 34);

    ctx.fillStyle = BONE_MUTE;
    ctx.font = `400 17px ${BODY}`;
    ctx.fillText(
      `${item.slotName} · ${item.exercise.equipment} · rest ${item.rest}`,
      textX,
      y + 62
    );

    // Sets x reps, right-aligned.
    ctx.textAlign = 'right';
    ctx.fillStyle = BONE;
    ctx.font = `900 42px ${DISPLAY}`;
    ctx.fillText(`${item.sets} × ${item.reps}`, W - PAD - 18, y + 46);
    ctx.textAlign = 'left';
  });

  /* ---------- footer ---------- */
  const fy = H - PAD - 46;
  ctx.strokeStyle = RULE;
  ctx.beginPath();
  ctx.moveTo(PAD, fy - 26);
  ctx.lineTo(W - PAD, fy - 26);
  ctx.stroke();

  ctx.fillStyle = BONE_MUTE;
  ctx.font = `500 17px ${MONO}`;
  tracked(ctx, `${meta.totalSets} WORKING SETS`, PAD, fy + 6, 1.8);

  ctx.textAlign = 'right';
  ctx.fillStyle = VOLT;
  ctx.font = `800 30px ${DISPLAY}`;
  ctx.fillText('NOW GO LIFT', W - PAD, fy + 10);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

/** Filename like iron-index-push-day.png */
export function cardFilename(workout) {
  const slug = workout.meta.splitLabel.toLowerCase().replace(/\s+/g, '-');
  return `iron-index-${slug}-day.png`;
}
