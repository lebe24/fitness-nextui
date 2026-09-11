import './Ticker.css';

const DEFAULT_WORDS = [
  'push',
  'pull',
  'hinge',
  'squat',
  'carry',
  'brace',
  'recover',
  'repeat',
];

const Ticker = ({ words }) => {
  const items = words && words.length ? words : DEFAULT_WORDS;
  // Rendered twice so the translate loop is seamless.
  const run = [...items, ...items];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {run.map((word, i) => (
          <span className="ticker__item" key={`${word}-${i}`}>
            {word}
            <span className="ticker__sep">✱</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
