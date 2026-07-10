import React from "react";
import { Quote } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "★";

const Avatar = ({ name, photo }) =>
  photo ? (
    <img
      src={photo}
      alt={name}
      loading="lazy"
      decoding="async"
      className="h-12 w-12 shrink-0 rounded-full border border-gold/40 object-cover"
    />
  ) : (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/12 text-sm font-bold text-gold">
      {initials(name)}
    </span>
  );

const TestimonialCard = ({ t }) => (
  <figure className="tilt-sm flex h-full flex-col rounded-3xl border border-line-dark bg-ink-soft p-7 shadow-deep md:p-8">
    <Quote size={30} className="mb-5 shrink-0 text-gold" strokeWidth={1.5} />
    <blockquote className="flex-1 text-[15px] leading-relaxed text-mist md:text-base">
      {t.comment}
    </blockquote>
    <figcaption className="mt-7 flex items-center gap-4 border-t border-line-dark pt-6">
      <Avatar name={t.name} photo={t.photo} />
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-semibold text-ivory">{t.name}</p>
        {t.designation && (
          <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">
            {t.designation}
          </p>
        )}
      </div>
    </figcaption>
  </figure>
);

/**
 * Client testimonials — dark, gold-accented social proof. Mobile shows a
 * snap-scroll rail; desktop a responsive grid. A single testimonial is
 * centred. Renders nothing when the property has no testimonials.
 */
const Testimonials = () => {
  const { data, loading } = useApi("testimonials");
  const list = data?.testimonial || [];
  const page = data?.page?.[0];

  if (!loading && list.length === 0) return null;

  const single = list.length === 1;

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-28">
      {/* Ambient gold glows for depth */}
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-gold/6 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-gold/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="In Their Words"
          title={page?.heading || "What Our Clients Say"}
          sub={page?.subheading || "Real experiences from families who found their home with us."}
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-dark h-56 rounded-3xl" />
            ))}
          </div>
        ) : single ? (
          <Reveal className="mx-auto max-w-2xl">
            <TestimonialCard t={list[0]} />
          </Reveal>
        ) : (
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-6">
            {list.map((t, i) => (
              <Reveal
                key={t.id}
                delay={(i % 3) * 90}
                className="w-[82%] shrink-0 snap-start sm:w-auto"
              >
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
