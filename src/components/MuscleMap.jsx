import { useEffect, useState } from 'react';
import {
  MUSCLES,
  INERT,
  MUSCLE_NAME,
  coverageOf,
  countsOf,
  levelsOf,
} from '../lib/muscles';
import './MuscleMap.css';

/**
 * The geometry is ~90 KB, so it is fetched on first render rather than riding
 * along in the main bundle. Shared across every mounted map.
 */
let CACHE = null;
let PENDING = null;

function useBodyPaths() {
  const [paths, setPaths] = useState(CACHE);

  useEffect(() => {
    if (CACHE) return undefined;
    let alive = true;
    PENDING = PENDING || import('../lib/body-paths').then((m) => (CACHE = m.default));
    PENDING.then((p) => {
      if (alive) setPaths(p);
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return paths;
}

const View = ({ view, label, levels, selected, onSelect }) => (
  <figure className="bmap__view">
    <svg className="bmap__svg" viewBox={view.vb} role="img" aria-label={`${label} view`}>
      {INERT.map((slug) =>
        (view.p[slug] || []).map((d, i) => (
          <path key={`${slug}-${i}`} className="bmap__sil" d={d} />
        ))
      )}
      {MUSCLES.map((slug) =>
        (view.p[slug] || []).map((d, i) => (
          <path
            key={`${slug}-${i}`}
            className={
              `bmap__muscle l${levels[slug] || 0}` +
              (selected === slug ? ' is-on' : '') +
              (levels[slug] ? '' : ' is-empty')
            }
            d={d}
            onClick={levels[slug] ? () => onSelect(slug) : undefined}
          >
            <title>{MUSCLE_NAME[slug]}</title>
          </path>
        ))
      )}
    </svg>
    <figcaption>{label}</figcaption>
  </figure>
);

const MuscleMap = ({ exercises, selected, onSelect, bodyPart }) => {
  const paths = useBodyPaths();
  const coverage = coverageOf(exercises);
  const counts = countsOf(exercises);
  const levels = levelsOf(coverage);
  const present = MUSCLES.filter((m) => counts[m]);
  const geometry = paths && paths.male;

  if (!present.length) {
    return (
      <div className="bmap bmap--none">
        <p className="bmap__none">
          Nothing in the {bodyPart} group resolves to a muscle the map can draw,
          so there is nothing to narrow by here.
        </p>
      </div>
    );
  }

  return (
    <div className="bmap">
      <div className="bmap__figures">
        {geometry ? (
          <>
            <View
              view={geometry.front}
              label="Front"
              levels={levels}
              selected={selected}
              onSelect={onSelect}
            />
            <View
              view={geometry.back}
              label="Back"
              levels={levels}
              selected={selected}
              onSelect={onSelect}
            />
          </>
        ) : (
          <div className="bmap__placeholder skeleton" aria-hidden="true" />
        )}
      </div>

      <div className="bmap__panel">
        <div className="bmap__legend" aria-hidden="true">
          <span>Fewer</span>
          <i className="bmap__swatch l1" />
          <i className="bmap__swatch l2" />
          <i className="bmap__swatch l3" />
          <i className="bmap__swatch l4" />
          <span>More</span>
        </div>

        <ul className="bmap__list">
          <li>
            <button
              type="button"
              className={`bmap__row bmap__row--all${selected ? '' : ' is-on'}`}
              onClick={() => onSelect(null)}
            >
              <span className="bmap__row-name">All muscles</span>
              <span className="bmap__row-count">{exercises.length}</span>
            </button>
          </li>
          {present.map((slug) => (
            <li key={slug}>
              <button
                type="button"
                className={`bmap__row${selected === slug ? ' is-on' : ''}`}
                aria-pressed={selected === slug}
                onClick={() => onSelect(selected === slug ? null : slug)}
              >
                <span className="bmap__row-name">{MUSCLE_NAME[slug]}</span>
                <span
                  className={`bmap__row-bar l${levels[slug]}`}
                  style={{ '--fill': `${Math.round((levels[slug] / 4) * 100)}%` }}
                  aria-hidden="true"
                />
                <span className="bmap__row-count">{counts[slug]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MuscleMap;
