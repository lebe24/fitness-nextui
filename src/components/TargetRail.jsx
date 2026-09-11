import { useRef } from 'react';
import './TargetRail.css';

const pad = (n) => String(n + 1).padStart(2, '0');

const TargetRail = ({ parts, active, onSelect, status, error }) => {
  const trackRef = useRef(null);

  const nudge = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="rail shell" id="target">
      <div className="chapter">
        <span className="chapter__num">02 /</span>
        <h2 className="chapter__title">Select target</h2>
        <p className="chapter__note">
          {status === 'ready' ? `${parts.length} groups indexed` : 'Loading index'}
          <br />
          Scroll or use arrow keys
        </p>
      </div>

      {status === 'error' && (
        <p className="rail__error" role="alert">
          Could not load the target index. {error}
        </p>
      )}

      <div className="rail__frame">
        <div
          className="rail__track"
          ref={trackRef}
          role="group"
          aria-label="Target muscle groups"
        >
          {status === 'loading' &&
            Array.from({ length: 6 }).map((_, i) => (
              <div className="target target--ghost skeleton" key={`ghost-${i}`} />
            ))}

          {status === 'ready' &&
            parts.map((part, i) => {
              const isActive = part === active;
              return (
                <button
                  type="button"
                  key={part}
                  className={`target${isActive ? ' target--on' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => onSelect(part)}
                >
                  <span className="target__num">{pad(i)}</span>
                  <span className="target__hazard" aria-hidden="true" />
                  <span className="target__name">{part}</span>
                  <span className="target__foot">
                    <span className="target__label">
                      {isActive ? 'Showing' : 'View'}
                    </span>
                    <span className="target__arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </button>
              );
            })}
        </div>

        <div className="rail__controls">
          <button
            type="button"
            className="rail__nudge"
            onClick={() => nudge(-1)}
            aria-label="Scroll targets left"
          >
            ←
          </button>
          <button
            type="button"
            className="rail__nudge"
            onClick={() => nudge(1)}
            aria-label="Scroll targets right"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TargetRail;
