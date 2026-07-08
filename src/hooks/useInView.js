import { useEffect, useRef, useState } from "react";

/** True while scripts/prerender.mjs is snapshotting the page. */
export const isPrerender = () =>
  typeof window !== "undefined" && window.__PRERENDER__ === true;

/**
 * Returns [ref, inView]. `inView` flips to true once the node nears the
 * viewport and stays true (used for lazy mounting + scroll reveals).
 * During prerendering everything counts as in view, so the full page —
 * every lazy section and reveal — is captured into the static HTML.
 */
export default function useInView(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(isPrerender);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, inView]);

  return [ref, inView];
}
