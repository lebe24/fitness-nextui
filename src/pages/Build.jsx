import { useEffect } from 'react';
import WorkoutBuilder from '../components/WorkoutBuilder';
import RouteLink from '../components/RouteLink';
import './Build.css';

const TITLE = 'Build a session — Iron Index';

export default function Build() {
  // No router library means no document title handling either; one effect is
  // cheaper than the dependency.
  useEffect(() => {
    const previous = document.title;
    document.title = TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="page">
      <section className="build shell">
        <div className="chapter">
          <span className="chapter__num">01 /</span>
          <h1 className="chapter__title">Build a session</h1>
          <p className="chapter__note">
            Pick a split
            <br />
            Download it or ask the coach
          </p>
        </div>

        <p className="build__lede">
          Every session is drawn from the same 1,324-movement archive. Compounds
          land in the first half while you are fresh, isolation finishes the
          muscle off, and the sets and reps follow the goal you pick.
        </p>

        <WorkoutBuilder />

        <p className="build__back">
          <RouteLink to="/#target">← Back to the archive</RouteLink>
        </p>
      </section>
    </main>
  );
}
