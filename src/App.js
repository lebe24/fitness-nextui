import { useCallback, useEffect, useMemo, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import TargetRail from './components/TargetRail';
import Toolbar from './components/Toolbar';
import ExerciseGrid from './components/ExerciseGrid';
import VideoGrid from './components/VideoGrid';
import Pager from './components/Pager';
import StateBlock from './components/StateBlock';
import MuscleMap from './components/MuscleMap';
import Footer from './components/Footer';
import {
  fetchBodyParts,
  fetchCatalogueCount,
  fetchExercisesByBodyPart,
} from './services/exerciseapi';
import { randomQuote } from './services/quotes';
import { MUSCLE_NAME, trains } from './lib/muscles';
import { searchVideos } from './services/youtubechannelapi';

const PAGE_SIZE = 12;
const DEFAULT_PART = 'back';

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function App() {
  const [quote] = useState(randomQuote);
  const [parts, setParts] = useState({ status: 'loading', data: [], error: '' });
  const [activePart, setActivePart] = useState(DEFAULT_PART);
  const [exercises, setExercises] = useState({ status: 'loading', data: [], error: '' });
  const [videos, setVideos] = useState({ status: 'idle', data: [], error: '' });
  const [mode, setMode] = useState('exercises');
  const [query, setQuery] = useState('');
  const [term, setTerm] = useState('');
  const [page, setPage] = useState(1);
  const [catalogueCount, setCatalogueCount] = useState(0);
  const [muscle, setMuscle] = useState(null);

  /* ---------- target index ---------- */
  useEffect(() => {
    const controller = new AbortController();
    fetchCatalogueCount(controller.signal)
      .then(setCatalogueCount)
      .catch(() => {});
    fetchBodyParts(controller.signal)
      .then((data) => setParts({ status: 'ready', data, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setParts({ status: 'error', data: [], error: err.message });
      });
    return () => controller.abort();
  }, []);

  /* ---------- exercises for the active target ---------- */
  useEffect(() => {
    const controller = new AbortController();
    setExercises({ status: 'loading', data: [], error: '' });
    fetchExercisesByBodyPart(activePart, controller.signal)
      .then((data) => setExercises({ status: 'ready', data, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setExercises({ status: 'error', data: [], error: err.message });
      });
    return () => controller.abort();
  }, [activePart]);

  /* ---------- video search ---------- */
  useEffect(() => {
    if (!term) return undefined;
    const controller = new AbortController();
    setVideos({ status: 'loading', data: [], error: '' });
    searchVideos(term, controller.signal)
      .then((data) => setVideos({ status: 'ready', data, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setVideos({ status: 'error', data: [], error: err.message });
      });
    return () => controller.abort();
  }, [term]);

  const handleSelectPart = useCallback((part) => {
    setActivePart(part);
    setMuscle(null);
    setPage(1);
    setMode('exercises');
    scrollToId('muscles');
  }, []);

  const handleSelectMuscle = useCallback((slug) => {
    setMuscle(slug);
    setPage(1);
    setMode('exercises');
    scrollToId('results');
  }, []);

  const handleSubmitSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setTerm(trimmed);
    setMode('videos');
    scrollToId('results');
  }, [query]);

  const handleChangePage = useCallback((next) => {
    setPage(next);
    scrollToId('results');
  }, []);

  const filtered = useMemo(
    () => (muscle ? exercises.data.filter((e) => trains(e, muscle)) : exercises.data),
    [exercises.data, muscle]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const offset = (page - 1) * PAGE_SIZE;
  const pageItems = useMemo(
    () => filtered.slice(offset, offset + PAGE_SIZE),
    [filtered, offset]
  );

  const chapterTitle =
    mode === 'exercises'
      ? muscle
        ? `${activePart} · ${MUSCLE_NAME[muscle]}`
        : activePart
      : term || 'Technique video';

  const chapterNote =
    mode === 'exercises'
      ? exercises.status === 'ready'
        ? `${filtered.length} movements filed`
        : 'Reading the archive'
      : videos.status === 'ready'
      ? `${videos.data.length} clips found`
      : 'YouTube search';

  return (
    <div className="grain">
      <Nav onStart={() => scrollToId('target')} />

      <main>
        <Hero
          quote={quote}
          targetCount={parts.data.length}
          exerciseCount={catalogueCount}
          onBrowse={() => scrollToId('target')}
        />

        <Ticker words={parts.status === 'ready' ? parts.data : undefined} />

        <TargetRail
          parts={parts.data}
          active={activePart}
          onSelect={handleSelectPart}
          status={parts.status}
          error={parts.error}
        />

        <section className="muscles shell" id="muscles">
          <div className="chapter">
            <span className="chapter__num">03 /</span>
            <h2 className="chapter__title">Muscle map</h2>
            <p className="chapter__note">
              {activePart} group
              <br />
              Pick a muscle to narrow
            </p>
          </div>

          {exercises.status === 'ready' ? (
            <MuscleMap
              exercises={exercises.data}
              selected={muscle}
              onSelect={handleSelectMuscle}
              bodyPart={activePart}
            />
          ) : (
            <div className="muscles__ghost skeleton" />
          )}
        </section>

        <section className="results shell" id="results">
          <div className="chapter">
            <span className="chapter__num">04 /</span>
            <h2 className="chapter__title">{chapterTitle}</h2>
            <p className="chapter__note">{chapterNote}</p>
          </div>

          <Toolbar
            mode={mode}
            onMode={setMode}
            query={query}
            onQuery={setQuery}
            onSubmit={handleSubmitSearch}
          />

          {mode === 'exercises' && (
            <>
              {exercises.status === 'error' ? (
                <StateBlock tone="alert" code="Error 04-A" title="Archive unreachable">
                  {exercises.error} The catalogue is served from{' '}
                  <code>public/exercises.json</code>.
                </StateBlock>
              ) : exercises.status === 'ready' && filtered.length === 0 ? (
                <StateBlock code="Empty" title="Nothing filed here">
                  {muscle
                    ? `No ${activePart} movements train the ${MUSCLE_NAME[muscle].toLowerCase()}. Clear the muscle filter or pick another target.`
                    : `No movements are indexed under ${activePart}. Pick another target from the index above.`}
                </StateBlock>
              ) : (
                <>
                  <ExerciseGrid
                    exercises={pageItems}
                    loading={exercises.status === 'loading'}
                    offset={offset}
                    pageSize={PAGE_SIZE}
                    activeMuscle={muscle}
                  />
                  {exercises.status === 'ready' && (
                    <Pager
                      page={page}
                      total={totalPages}
                      onChange={handleChangePage}
                      rangeStart={offset + 1}
                      rangeEnd={Math.min(offset + PAGE_SIZE, filtered.length)}
                      count={filtered.length}
                      unit="movements"
                    />
                  )}
                </>
              )}
            </>
          )}

          {mode === 'videos' && (
            <>
              {videos.status === 'idle' ? (
                <StateBlock code="Standby" title="Search for a clip">
                  Type a movement or a session into the field above — deadlift
                  setup, hip mobility, push day — and press search.
                </StateBlock>
              ) : videos.status === 'error' ? (
                <StateBlock tone="alert" code="Error 04-B" title="Search failed">
                  {videos.error} Set <code>REACT_APP_YOUTUBE_API_KEY</code> in{' '}
                  <code>.env.local</code> and restart the dev server.
                </StateBlock>
              ) : videos.status === 'ready' && videos.data.length === 0 ? (
                <StateBlock code="Empty" title="No clips returned">
                  Nothing came back for “{term}”. Try a broader term.
                </StateBlock>
              ) : (
                <VideoGrid
                  videos={videos.data}
                  loading={videos.status === 'loading'}
                />
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
