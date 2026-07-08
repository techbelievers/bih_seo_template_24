import React from "react";
import useInView from "../../hooks/useInView";

/**
 * Defers mounting (and therefore data fetching) of below-the-fold sections
 * until the user scrolls near them. Keeps first paint light and staggers
 * network requests naturally. `minHeight` reserves space to avoid CLS.
 *
 * `anchor` puts the section's id on this always-mounted wrapper so nav
 * links (#faq, #contact…) work even before the content mounts.
 */
const LazySection = ({ children, anchor, minHeight = 320 }) => {
  const [ref, inView] = useInView("900px 0px 900px 0px");
  return (
    <div ref={ref} id={anchor} style={inView ? undefined : { minHeight }}>
      {inView ? children : null}
    </div>
  );
};

export default LazySection;
