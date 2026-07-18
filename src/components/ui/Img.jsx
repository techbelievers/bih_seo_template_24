import React, { useLayoutEffect, useRef, useState } from "react";

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
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // An image can finish before React attaches onLoad — a cache hit, or the
  // element being rebuilt when React takes over the prerendered DOM. The event
  // is missed and the image would sit at opacity-0 behind a shimmer forever.
  // Layout effect, not effect: this runs before paint, so a already-complete
  // image never shows a blank frame.
  useLayoutEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${loaded ? "" : dark ? "skeleton-dark" : "skeleton"} ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        // A broken URL would otherwise shimmer indefinitely.
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
        {...rest}
      />
    </div>
  );
};

export default Img;
