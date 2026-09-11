import './Toolbar.css';

const MODES = [
  { id: 'exercises', label: 'Exercises' },
  { id: 'videos', label: 'Technique video' },
];

const Toolbar = ({ mode, onMode, query, onQuery, onSubmit }) => (
  <div className="toolbar">
    <div className="segmented" role="tablist" aria-label="Result type">
      <span
        className="segmented__thumb"
        style={{ transform: `translateX(${mode === 'videos' ? '100%' : '0'})` }}
        aria-hidden="true"
      />
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          className={`segmented__tab${mode === m.id ? ' is-on' : ''}`}
          onClick={() => onMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>

    <form
      className="finder"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      role="search"
    >
      <label className="finder__label" htmlFor="finder-input">
        Search
      </label>
      <input
        id="finder-input"
        className="finder__input"
        type="search"
        value={query}
        placeholder="Deadlift form, mobility drills, push day…"
        onChange={(e) => onQuery(e.target.value)}
      />
      <button type="submit" className="finder__go" disabled={!query.trim()}>
        <span>Search</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  </div>
);

export default Toolbar;
