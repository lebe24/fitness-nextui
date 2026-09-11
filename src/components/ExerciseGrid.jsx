import { useEffect, useMemo, useState } from 'react';
import { MUSCLE_NAME, MUSCLES, musclesOf } from '../lib/muscles';
import './ExerciseGrid.css';

const pad = (n) => String(n).padStart(3, '0');

/**
 * The still frame carries the card; the animation is only requested once the
 * viewer asks for it. Hover drives it on a mouse, the corner button drives it
 * on touch and for keyboard users.
 */
const ExerciseCard = ({ exercise, index, position, activeMuscle }) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [armed, setArmed] = useState(false);

  const playing = pinned || hovered;

  useEffect(() => {
    if (playing) setArmed(true);
  }, [playing]);

  const hasMedia = Boolean(exercise.imgUrl || exercise.gifUrl);

  // Head-to-toe so every card lists its muscles in the same order as the map.
  const worked = useMemo(() => {
    const m = musclesOf(exercise);
    return MUSCLES.filter((slug) => m[slug]).map((slug) => ({
      slug,
      primary: m[slug] === 1,
    }));
  }, [exercise]);

  return (
    <article className="ex rise" style={{ animationDelay: `${index * 55}ms` }}>
      <div
        className={`ex__media${hasMedia ? '' : ' ex__media--plate'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="ex__num">{pad(position)}</span>

        {hasMedia ? (
          <>
            <img
              className="ex__still"
              src={exercise.imgUrl || exercise.gifUrl}
              alt={exercise.name}
              loading="lazy"
              decoding="async"
            />
            {armed && exercise.gifUrl && (
              <img
                className={`ex__gif${playing ? ' is-on' : ''}`}
                src={exercise.gifUrl}
                alt=""
                aria-hidden="true"
                decoding="async"
              />
            )}
            <button
              type="button"
              className="ex__toggle"
              aria-pressed={pinned}
              aria-label={
                pinned
                  ? `Pause the ${exercise.name} demonstration`
                  : `Play the ${exercise.name} demonstration`
              }
              onClick={() => setPinned((p) => !p)}
            >
              <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
              <span className="ex__toggle-text">{playing ? 'Playing' : 'Play'}</span>
            </button>
          </>
        ) : (
          <div className="ex__plate" aria-hidden="true">
            <span className="ex__plate-name">{exercise.name}</span>
            <span className="ex__plate-note">No demo loop</span>
          </div>
        )}
      </div>

      <div className="ex__body">
        <h3 className="ex__name">{exercise.name}</h3>

        {worked.length > 0 && (
          <ul className="ex__muscles">
            {worked.map(({ slug, primary }) => (
              <li
                key={slug}
                className={
                  `ex__muscle${primary ? ' is-primary' : ''}` +
                  (slug === activeMuscle ? ' is-active' : '')
                }
              >
                {MUSCLE_NAME[slug]}
              </li>
            ))}
          </ul>
        )}

        <dl className="ex__meta">
          <div>
            <dt>Target</dt>
            <dd>{exercise.target || '—'}</dd>
          </div>
          <div>
            <dt>Kit</dt>
            <dd>{exercise.equipment || 'body weight'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
};

const GhostCard = () => (
  <div className="ex ex--ghost">
    <div className="ex__media skeleton" />
    <div className="ex__body">
      <div className="ex__ghost-line skeleton" />
      <div className="ex__ghost-line ex__ghost-line--short skeleton" />
    </div>
  </div>
);

const ExerciseGrid = ({ exercises, loading, offset = 0, pageSize = 12, activeMuscle }) => {
  if (loading) {
    return (
      <div className="ex-grid">
        {Array.from({ length: pageSize }).map((_, i) => (
          <GhostCard key={`ghost-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="ex-grid">
      {exercises.map((exercise, i) => (
        <ExerciseCard
          key={exercise.id || exercise.name}
          exercise={exercise}
          index={i}
          position={offset + i + 1}
          activeMuscle={activeMuscle}
        />
      ))}
    </div>
  );
};

export default ExerciseGrid;
