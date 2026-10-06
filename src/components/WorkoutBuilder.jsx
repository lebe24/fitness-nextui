import { useCallback, useEffect, useMemo, useState } from 'react';
import { SPLITS, KITS, GOALS, LENGTHS, buildWorkout, workoutToText } from '../lib/workout';
import { renderWorkoutCard, cardFilename } from '../lib/workoutCard';
import { fetchAllExercises } from '../services/exerciseapi';
import CoachChat from './CoachChat';
import StateBlock from './StateBlock';
import './WorkoutBuilder.css';

const OPTION_GROUPS = [
  { key: 'split', label: 'Session', options: SPLITS },
  { key: 'goal', label: 'Goal', options: GOALS },
  { key: 'kit', label: 'Kit', options: KITS },
  { key: 'length', label: 'Length', options: LENGTHS },
];

const Chips = ({ label, options, value, onChange, name }) => (
  <fieldset className="wb__group">
    <legend className="wb__legend">{label}</legend>
    <div className="wb__chips">
      {Object.entries(options).map(([id, opt]) => (
        <button
          key={id}
          type="button"
          className={`wb__chip${value === id ? ' is-on' : ''}`}
          aria-pressed={value === id}
          onClick={() => onChange(name, id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </fieldset>
);

const WorkoutBuilder = () => {
  const [catalogue, setCatalogue] = useState({ status: 'loading', data: [], error: '' });
  const [choice, setChoice] = useState({
    split: 'push',
    goal: 'hypertrophy',
    kit: 'full',
    length: 'standard',
  });
  const [seed, setSeed] = useState(1);
  const [cardState, setCardState] = useState('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchAllExercises(controller.signal)
      .then((data) => setCatalogue({ status: 'ready', data, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setCatalogue({ status: 'error', data: [], error: err.message });
      });
    return () => controller.abort();
  }, []);

  const setOption = useCallback((name, id) => {
    setChoice((c) => ({ ...c, [name]: id }));
  }, []);

  // Regenerating is instant, so the session rebuilds as the controls change
  // rather than hiding behind a submit button.
  const workout = useMemo(() => {
    if (catalogue.status !== 'ready') return null;
    return buildWorkout(catalogue.data, { ...choice, seed });
  }, [catalogue, choice, seed]);

  const handleDownload = useCallback(async () => {
    if (!workout) return;
    setCardState('working');
    try {
      const url = await renderWorkoutCard(workout);
      const a = document.createElement('a');
      a.href = url;
      a.download = cardFilename(workout);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setCardState('done');
      setTimeout(() => setCardState('idle'), 2500);
    } catch {
      setCardState('error');
      setTimeout(() => setCardState('idle'), 4000);
    }
  }, [workout]);

  const handleCopy = useCallback(async () => {
    if (!workout) return;
    try {
      await navigator.clipboard.writeText(workoutToText(workout));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; the card download still works */
    }
  }, [workout]);

  if (catalogue.status === 'error') {
    return (
      <StateBlock tone="alert" code="Error 05-A" title="Builder unavailable">
        {catalogue.error} The catalogue is served from <code>public/exercises.json</code>.
      </StateBlock>
    );
  }

  return (
    <div className="wb">
      <form className="wb__controls" onSubmit={(e) => e.preventDefault()}>
        {OPTION_GROUPS.map((g) => (
          <Chips
            key={g.key}
            name={g.key}
            label={g.label}
            options={g.options}
            value={choice[g.key]}
            onChange={setOption}
          />
        ))}
      </form>

      {!workout ? (
        <div className="wb__sheet wb__sheet--ghost skeleton" />
      ) : (
        <>
          <div className="wb__sheet">
            <header className="wb__head">
              <div>
                <h3 className="wb__title">{SPLITS[choice.split].label} day</h3>
                <p className="wb__sub">
                  {workout.meta.goalLabel} · {workout.meta.kitLabel} · ~{workout.meta.minutes} min ·{' '}
                  {workout.meta.totalSets} working sets
                </p>
              </div>
              <button type="button" className="wb__shuffle" onClick={() => setSeed((s) => s + 1)}>
                Shuffle
              </button>
            </header>

            <ol className="wb__list">
              {workout.exercises.map((item) => (
                <li className="wb__row" key={item.exercise.id}>
                  <span className="wb__num">{String(item.order).padStart(2, '0')}</span>
                  <span
                    className={`wb__thumb${item.exercise.imgUrl ? '' : ' wb__thumb--empty'}`}
                    aria-hidden="true"
                  >
                    {item.exercise.imgUrl && (
                      <img src={item.exercise.imgUrl} alt="" loading="lazy" decoding="async" />
                    )}
                  </span>
                  <span className="wb__name">
                    {item.exercise.name}
                    <span className="wb__tags">
                      <span className={item.compound ? 'is-compound' : ''}>
                        {item.compound ? 'Compound' : 'Isolation'}
                      </span>
                      <span>{item.slotName}</span>
                      <span>{item.exercise.equipment}</span>
                    </span>
                  </span>
                  <span className="wb__scheme">
                    <strong>
                      {item.sets} × {item.reps}
                    </strong>
                    <span>rest {item.rest}</span>
                  </span>
                </li>
              ))}
            </ol>

            <footer className="wb__actions">
              <button
                type="button"
                className="btn btn--solid"
                onClick={handleDownload}
                disabled={cardState === 'working'}
              >
                <span>
                  {cardState === 'working' && 'Rendering…'}
                  {cardState === 'done' && 'Saved'}
                  {cardState === 'error' && 'Render failed'}
                  {cardState === 'idle' && 'Download card'}
                </span>
              </button>
              <button type="button" className="btn" onClick={handleCopy}>
                <span>{copied ? 'Copied' : 'Copy as text'}</span>
              </button>
              <p className="wb__note">1080 × 1350 PNG, sized for a feed post.</p>
            </footer>
          </div>

          <CoachChat workout={workout} />
        </>
      )}
    </div>
  );
};

export default WorkoutBuilder;
