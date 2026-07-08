import React from "react";
import useInView from "../../hooks/useInView";

/** Scroll-reveal wrapper: fades + rises content as it enters the viewport. */
const Reveal = ({ children, delay = 0, className = "", as: Tag = "div" }) => {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
