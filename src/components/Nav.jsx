import { useEffect, useState } from 'react';
import './Nav.css';

const LINKS = [
  { label: 'Index', href: '#target' },
  { label: 'Muscles', href: '#muscles' },
  { label: 'Archive', href: '#results' },
  { label: 'Colophon', href: '#colophon' },
];

const Nav = ({ onStart }) => {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${lifted ? ' nav--lifted' : ''}`}>
      <div className="nav__inner shell">
        <a className="mark" href="#top">
          <span className="mark__glyph" aria-hidden="true">
            II
          </span>
          <span className="mark__words">
            <span className="mark__name">Iron Index</span>
            <span className="mark__sub">Training archive</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.href} className="nav__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button type="button" className="btn btn--solid nav__cta" onClick={onStart}>
          <span>Start lifting</span>
        </button>
      </div>
    </header>
  );
};

export default Nav;
