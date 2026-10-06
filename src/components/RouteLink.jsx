import { isPlainClick, navigate } from '../lib/router';

/**
 * A real anchor that routes in-app on a plain click. Modifier-clicks and
 * middle-clicks fall through to the browser, so "open in new tab" still works
 * and the href is a genuine URL for crawlers and the status bar.
 */
const RouteLink = ({ to, children, className, onNavigate, ...rest }) => (
  <a
    href={to}
    className={className}
    onClick={(e) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      navigate(to);
      if (onNavigate) onNavigate();
    }}
    {...rest}
  >
    {children}
  </a>
);

export default RouteLink;
