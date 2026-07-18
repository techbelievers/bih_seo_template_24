import React from "react";
import useInView from "../../hooks/useInView";

/**
 * True when this page was served with prerendered markup and inlined API
 * payloads. Read once at module scope — the static HTML sets the global in an
 * inline script that runs before this bundle (same contract as lib/api.js).
 */
const PRELOADED =
  typeof window !== "undefined" && !!window.__PRELOADED_API__;

/**
 * Defers mounting (and therefore data fetching) of below-the-fold sections
 * until the user scrolls near them. Keeps first paint light and staggers
 * network requests naturally. `minHeight` reserves space to avoid CLS.
 *
 * `anchor` puts the section's id on this always-mounted wrapper so nav
 * links (#faq, #contact…) work even before the content mounts.
 *
 * On a prerendered load every section is already painted and its data is
 * already inlined, so they all stay mounted through React's takeover. Without
 * this the first client render drops every below-fold section and the visible
 * page collapses before popping back — a hard blink. Deferring buys nothing
 * there anyway, since the markup is on screen and no request is saved.
 */
const LazySection = ({ children, anchor, minHeight = 320 }) => {
  const [ref, inView] = useInView("900px 0px 900px 0px");
  const show = inView || PRELOADED;
  return (
    <div ref={ref} id={anchor} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
};

export default LazySection;
