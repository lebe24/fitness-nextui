import './Footer.css';

const CONTACT = [
  { label: 'GitHub', handle: 'lebe24', href: 'https://github.com/lebe24' },
  { label: 'Site', handle: 'lebe.pages.dev', href: 'https://lebe.pages.dev/' },
  { label: 'X', handle: '@emmanuellebe24', href: 'https://twitter.com/emmanuellebe24' },
];

const STACK = [
  { label: 'React 18', href: 'https://react.dev' },
  { label: 'exercises-dataset', href: 'https://github.com/hasaneyldrm/exercises-dataset' },
  { label: 'YouTube Data API', href: 'https://developers.google.com/youtube/v3' },
];

const Footer = () => (
  <footer className="foot" id="colophon">
    <div className="foot__banner">
      <span className="foot__banner-text">Now go lift</span>
    </div>

    <div className="foot__grid shell">
      <div className="foot__col foot__col--wide">
        <p className="eyebrow eyebrow--volt">Iron Index</p>
        <p className="foot__blurb">
          A training archive of 1,324 movements. Filed by target muscle,
          demonstrated in loop, free to browse. Data and media from the open
          exercises-dataset.
        </p>
      </div>

      <div className="foot__col">
        <p className="eyebrow">Contact</p>
        <ul className="foot__list">
          {CONTACT.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="foot__list-label">{item.label}</span>
                <span className="foot__list-handle">{item.handle}</span>
                <span className="foot__list-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="foot__col">
        <p className="eyebrow">Built with</p>
        <ul className="foot__list">
          {STACK.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="foot__list-handle">{item.label}</span>
                <span className="foot__list-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="foot__base shell">
      <p>© {new Date().getFullYear()} Iron Index — built by lebe24</p>
      <a className="foot__top" href="#top">
        Back to top ↑
      </a>
    </div>
  </footer>
);

export default Footer;
