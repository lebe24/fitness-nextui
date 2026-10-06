/**
 * POST /api/chat — the training coach behind the workout builder.
 *
 * Runs as a Vercel Node function so ANTHROPIC_API_KEY stays server-side. The
 * key must never be a REACT_APP_* variable: those are inlined into the browser
 * bundle and would be readable by anyone who opens devtools.
 *
 * This endpoint is public, so it is deliberately cheap and bounded: short
 * replies, low effort, a capped transcript, and per-IP rate limiting.
 */

const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-opus-5-5';

/* Replies are a few sentences of coaching, and the endpoint is open to the
   internet on a personal account, so the ceiling is deliberately low. */
const MAX_TOKENS = 700;

const MAX_MESSAGES = 16;        // transcript turns kept
const MAX_CHARS = 1500;         // per message
const MAX_WORKOUT_CHARS = 2000;

/* Per-IP token bucket. Serverless instances are recycled, so this catches
   bursts on a warm instance rather than enforcing a global quota — the real
   ceiling is the spend limit on the Anthropic account. */
const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 12;
const buckets = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const hits = (buckets.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= PER_WINDOW) {
    buckets.set(ip, hits);
    return true;
  }
  hits.push(now);
  buckets.set(ip, hits);
  if (buckets.size > 5000) buckets.clear();   // crude guard against growth
  return false;
}

const SYSTEM = `You are the training coach for Iron Index, a free exercise archive at ironindex.fit.

The user has just generated a workout. It is shown below when present. Answer questions about it: why an exercise is there, how to perform it, what to swap it for, how to progress it, how heavy to go, how to warm up.

Rules:
- Be brief. Two or three short paragraphs at most, usually less. No preamble.
- Be concrete. Name exercises, sets, reps and tempo rather than talking in generalities.
- If asked for a substitute, give one that trains the same muscle and say which.
- You are not a doctor. If the user describes pain, injury, dizziness, chest symptoms or a medical condition, say plainly that it needs a physio or doctor, and do not program around it.
- Never invent claims about Iron Index features you have not been told about.
- Stay on training, technique, recovery and nutrition-for-training. If asked about something else, say it is outside what you cover.`;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error: 'The coach is not configured. Set ANTHROPIC_API_KEY in the deployment environment.',
    });
  }

  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ error: 'Too many messages. Give it a few minutes.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Body must be JSON.' });
    }
  }

  const incoming = Array.isArray(body && body.messages) ? body.messages : null;
  if (!incoming || !incoming.length) {
    return res.status(400).json({ error: 'messages[] is required.' });
  }

  const messages = incoming
    .slice(-MAX_MESSAGES)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'The last message must be from the user.' });
  }

  const workout = typeof (body && body.workout) === 'string'
    ? body.workout.slice(0, MAX_WORKOUT_CHARS)
    : '';

  const system = workout
    ? `${SYSTEM}\n\nThe user's current workout:\n\n${workout}`
    : `${SYSTEM}\n\nThe user has not generated a workout yet.`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: 'low' },
      system,
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({
        reply: "I can't help with that one. Ask me something about the workout instead.",
      });
    }

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return res.status(200).json({ reply: reply || 'No answer came back. Try rephrasing.' });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'The coach is busy. Try again shortly.' });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(503).json({ error: 'The coach is misconfigured. Check ANTHROPIC_API_KEY.' });
    }
    // eslint-disable-next-line no-console
    console.error('[api/chat]', err);
    return res.status(502).json({ error: 'The coach could not be reached.' });
  }
};
