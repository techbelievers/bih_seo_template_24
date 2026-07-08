import React, { useState } from "react";

/**
 * Performance-first image: lazy + async by default, shimmer placeholder,
 * gentle fade-in on load, container-driven aspect ratio (zero CLS).
 * Set priority for the LCP image only.
 */
const Img = ({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  aspect, // e.g. "4/3" — reserves space before load
  priority = false,
  dark = false,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${loaded ? "" : dark ? "skeleton-dark" : "skeleton"} ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
        {...rest}
      />
    </div>
  );
};

export default Img;
