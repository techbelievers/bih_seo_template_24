import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { isPrerender } from "../../hooks/useInView";

/**
 * Collapsible rich-text (CMS HTML). The full content always stays in the
 * DOM (SEO), but is visually clamped until expanded. Expansion measures
 * the real scrollHeight instead of a hard max-height cap, so long
 * descriptions are never truncated. During prerender it renders fully open.
 */
const Expandable = ({
  html,
  dark = false,
  collapsedHeight = 320,
  align = "left",
  fadeFrom = "from-cream",
  moreLabel = "Continue Reading",
  lessLabel = "Read Less",
}) => {
  const bodyRef = useRef(null);
  const [open, setOpen] = useState(isPrerender);
  const [maxHeight, setMaxHeight] = useState(open ? "none" : `${collapsedHeight}px`);
  const [needsToggle, setNeedsToggle] = useState(true);

  // Decide whether the toggle is even needed (short content shows in full).
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => {
      const overflowing = el.scrollHeight > collapsedHeight + 24;
      setNeedsToggle(overflowing);
      if (!overflowing) setMaxHeight("none");
    };
    measure();
    // Re-measure once images/fonts settle.
    const t = setTimeout(measure, 400);
    return () => clearTimeout(t);
  }, [html, collapsedHeight]);

  const toggle = () => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      // Collapse: from current pixel height down to the clamp.
      setMaxHeight(`${el.scrollHeight}px`);
      requestAnimationFrame(() => setMaxHeight(`${collapsedHeight}px`));
      setOpen(false);
    } else {
      // Expand: animate to real height, then release the cap so the
      // content can still reflow (e.g. late-loading images).
      setMaxHeight(`${el.scrollHeight}px`);
      setOpen(true);
      setTimeout(() => setMaxHeight("none"), 720);
    }
  };

  if (!html) return null;
  const clamped = !open && needsToggle;

  return (
    <div>
      <div className="relative">
        <div
          ref={bodyRef}
          className={`prose-luxe ${dark ? "on-dark" : ""} ${
            align === "center" ? "text-center" : ""
          } transition-[max-height] duration-700 ease-in-out ${clamped ? "overflow-hidden" : ""}`}
          style={{ maxHeight }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {clamped && (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${fadeFrom} to-transparent`}
          />
        )}
      </div>
      {needsToggle && (
        <div className={align === "center" ? "mt-5 text-center" : "mt-4"}>
          <button
            onClick={toggle}
            aria-expanded={open}
            className={`inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.16em] transition ${
              dark ? "text-gold hover:text-gold-soft" : "text-gold-deep hover:text-gold"
            }`}
          >
            {open ? lessLabel : moreLabel}
            <ChevronDown
              size={15}
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Expandable;
