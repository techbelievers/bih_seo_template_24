import React from "react";

/**
 * Plain layout wrapper.
 *
 * This used to be a scroll-reveal (fade + 28px rise as each element entered
 * the viewport), but the page-wide staggered motion read as too busy, so the
 * animation was dropped. The element itself is kept because ~18 call sites
 * rely on it as their grid/flex child, and the `delay` prop is still accepted
 * (and ignored) so those call sites didn't all need touching.
 */
const Reveal = ({ children, className = "", as: Tag = "div" }) => (
  <Tag className={className}>{children}</Tag>
);

export default Reveal;
