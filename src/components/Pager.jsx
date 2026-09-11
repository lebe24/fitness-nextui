import './Pager.css';

/** Compact page window: first, last, current ±1, with ellipses between. */
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) out.push('gap');
    out.push(page);
  });
  return out;
}

const pad = (n) => String(n).padStart(2, '0');

const Pager = ({ page, total, onChange, rangeStart, rangeEnd, count, unit }) => {
  if (total <= 1) return null;

  return (
    <nav className="pager" aria-label="Pagination">
      <p className="pager__readout">
        Showing {pad(rangeStart)}–{pad(rangeEnd)} of {count} {unit}
      </p>

      <div className="pager__controls">
        <button
          type="button"
          className="pager__step"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ←
        </button>

        {pageWindow(page, total).map((entry, i) =>
          entry === 'gap' ? (
            <span className="pager__gap" key={`gap-${i}`} aria-hidden="true">
              ···
            </span>
          ) : (
            <button
              type="button"
              key={entry}
              className={`pager__num${entry === page ? ' is-on' : ''}`}
              onClick={() => onChange(entry)}
              aria-current={entry === page ? 'page' : undefined}
            >
              {pad(entry)}
            </button>
          )
        )}

        <button
          type="button"
          className="pager__step"
          onClick={() => onChange(page + 1)}
          disabled={page === total}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </nav>
  );
};

export default Pager;
