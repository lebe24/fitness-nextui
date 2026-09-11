import person from '../assets/female.png';
import './Hero.css';

const Hero = ({ quote, targetCount, exerciseCount, onBrowse }) => (
  <section className="hero" id="top">
    <div className="hero__grid shell">
      <div className="hero__lede">
        <p className="eyebrow hero__meta rise" style={{ animationDelay: '60ms' }}>
          <span>Vol. 01</span>
          <span className="hero__meta-rule" aria-hidden="true" />
          <span>Open movement archive</span>
        </p>

        <h1 className="hero__title">
          <span className="hero__line rise" style={{ animationDelay: '140ms' }}>
            Health
          </span>
          <span className="hero__row">
            <span className="hero__amp rise" style={{ animationDelay: '260ms' }}>
              &amp;
            </span>
            <span
              className="hero__line hero__line--hollow rise"
              style={{ animationDelay: '220ms' }}
            >
              Fitness
            </span>
          </span>
        </h1>

        <p className="hero__blurb rise" style={{ animationDelay: '340ms' }}>
          Pick a target. Get the movement. Every exercise in the archive is filed
          by the muscle it punishes, with the demonstration loop attached.
        </p>

        <div className="hero__actions rise" style={{ animationDelay: '420ms' }}>
          <button type="button" className="btn btn--solid" onClick={onBrowse}>
            <span>Browse the index</span>
          </button>
          <a className="btn" href="#results">
            <span>See the archive</span>
          </a>
        </div>

        <figure className="quote rise" style={{ animationDelay: '500ms' }}>
          <blockquote>{quote.quote}</blockquote>
          <figcaption>— {quote.author}</figcaption>
        </figure>
      </div>

      <figure className="hero__figure">
        <span className="hero__numeral" aria-hidden="true">
          01
        </span>
        <span className="hero__slab" aria-hidden="true" />
        <span className="hero__hazard" aria-hidden="true" />
        <img src={person} alt="An athlete mid-set" className="hero__photo" />
        <figcaption className="hero__caption">
          Fig. 1 — Loaded carry, posterior chain under tension
        </figcaption>
      </figure>
    </div>

    <dl className="stats shell">
      <div className="stat">
        <dt>Exercises</dt>
        <dd>{exerciseCount ? exerciseCount.toLocaleString() : '—'}</dd>
      </div>
      <div className="stat">
        <dt>Target groups</dt>
        <dd>{targetCount || '—'}</dd>
      </div>
      <div className="stat">
        <dt>Demo loops</dt>
        <dd>Every entry</dd>
      </div>
      <div className="stat">
        <dt>Price</dt>
        <dd>Free</dd>
      </div>
    </dl>
  </section>
);

export default Hero;
