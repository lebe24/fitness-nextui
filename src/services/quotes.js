/**
 * Masthead quotes.
 *
 * These used to come from a RapidAPI endpoint that needed a key and was down
 * more often than not. A local set costs nothing, never fails, and renders
 * before first paint.
 */

const QUOTES = [
  {
    quote:
      'The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.',
    author: 'Arnold Schwarzenegger',
  },
  {
    quote:
      'Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.',
    author: 'Ronnie Coleman',
  },
  {
    quote: 'The body achieves what the mind believes.',
    author: 'Napoleon Hill',
  },
  {
    quote:
      'Strength does not come from the physical capacity. It comes from an indomitable will.',
    author: 'Mahatma Gandhi',
  },
  {
    quote: 'The last three or four reps is what makes the muscle grow.',
    author: 'Arnold Schwarzenegger',
  },
  {
    quote: 'If something stands between you and your success, move it.',
    author: 'Dwayne Johnson',
  },
  {
    quote: 'You must do the thing you think you cannot do.',
    author: 'Eleanor Roosevelt',
  },
  {
    quote: 'It never gets easier, you just get better.',
    author: 'Jordan Hoechlin',
  },
  {
    quote: 'Take care of your body. It is the only place you have to live.',
    author: 'Jim Rohn',
  },
  {
    quote: 'Discipline is doing what you hate to do, but doing it like you love it.',
    author: 'Mike Tyson',
  },
];

/** A quote for this page load. */
export function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
