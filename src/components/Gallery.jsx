import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Img from "./ui/Img";

const Lightbox = ({ photos, index, setIndex, onClose }) => {
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length, setIndex]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length, setIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute right-4 top-4 z-10 rounded-full border border-white/20 p-2.5 text-ivory transition hover:border-gold hover:text-gold"
      >
        <X size={20} />
      </button>

      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-3 z-10 rounded-full border border-white/20 p-3 text-ivory transition hover:border-gold hover:text-gold sm:left-6"
      >
        <ChevronLeft size={20} />
      </button>

      <figure className="flex max-h-[86vh] w-full max-w-5xl flex-col items-center px-14">
        <img
          src={photos[index].photo}
          alt={`Gallery image ${index + 1}`}
          className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-deep"
        />
        <figcaption className="mt-4 text-sm tracking-[0.2em] text-mist">
          {index + 1} — {photos.length}
        </figcaption>
      </figure>

      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-3 z-10 rounded-full border border-white/20 p-3 text-ivory transition hover:border-gold hover:text-gold sm:right-6"
      >
        <ChevronRight size={20} />
      </button>
    </div>,
    document.body
  );
};

/** Editorial gallery: hero tile + tight grid, gold-framed hover, lightbox. */
const Gallery = () => {
  const { data, loading } = useApi("gallary");
  const [lightbox, setLightbox] = useState(null);
  const photos = data?.property_photos || [];
  const heading = data?.page?.[0]?.heading;

  if (!loading && photos.length === 0) return null;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Visual Journey"
          title={heading || "Gallery"}
          sub="A glimpse of the craftsmanship, light and landscape that await."
        />

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`skeleton rounded-2xl ${i === 0 ? "col-span-2 row-span-2 h-full min-h-64" : "h-40 md:h-48"}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {photos.map((p, i) => (
              <Reveal
                key={p.id}
                delay={(i % 4) * 60}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
              >
                <button
                  onClick={() => setLightbox(i)}
                  aria-label={`Open gallery image ${i + 1}`}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl border border-line shadow-lift transition-shadow duration-500 hover:shadow-float"
                >
                  <Img
                    src={p.photo}
                    alt={`${heading || "Property gallery"} — photo ${i + 1}`}
                    aspect={i === 0 ? "1/1" : "4/3"}
                    className="h-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/35">
                    <Expand
                      size={26}
                      className="scale-75 text-gold opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
                    />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox photos={photos} index={lightbox} setIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
};

export default Gallery;
