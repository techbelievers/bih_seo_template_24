import React from "react";
import Reveal from "./Reveal";

/** Consistent luxury section header: gold eyebrow, serif title, subline. */
const SectionHeading = ({ eyebrow, title, sub, dark = false, align = "center" }) => {
  const isCenter = align === "center";
  return (
    <Reveal className={`mb-12 md:mb-16 ${isCenter ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <p className={`eyebrow ${isCenter ? "hairline justify-center" : ""} mb-4`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl md:text-5xl font-semibold leading-tight tracking-tight ${
          dark ? "text-ivory" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed ${
            dark ? "text-mist" : "text-stone"
          } ${isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
};

export default SectionHeading;
