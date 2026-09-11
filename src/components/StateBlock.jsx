import './StateBlock.css';

/**
 * Shared empty / error / idle panel for the results region.
 * `tone` is "quiet" for empty states and "alert" for failures.
 */
const StateBlock = ({ tone = 'quiet', code, title, children }) => (
  <div className={`state state--${tone}`} role={tone === 'alert' ? 'alert' : undefined}>
    <span className="state__code">{code}</span>
    <h3 className="state__title">{title}</h3>
    {children ? <p className="state__body">{children}</p> : null}
  </div>
);

export default StateBlock;
