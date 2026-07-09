import React, { useEffect, useState } from "react";
import { MapPin, BadgeCheck, ArrowDown, Home, Ruler, CalendarCheck2 } from "lucide-react";
import useApi from "../hooks/useApi";
import { useEnquiry } from "../hooks/useEnquiry";

/**
 * Full-viewport cinematic hero. The first frame renders eagerly with
 * fetchpriority=high (LCP), further frames crossfade lazily.
 */
const Hero = () => {
  const { data: header, loading } = useApi("header");
  const openEnquiry = useEnquiry();
  const [slide, setSlide] = useState(0);

  const desktop = header?.hero_banner_img?.desktop || [];
  const mobile = header?.hero_banner_img?.mobile || [];
  const count = Math.max(desktop.length, 1);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const facts = [
    { icon: Home, label: "Configuration", value: header?.property_type_price_range_text },
    { icon: Ruler, label: "Area Range", value: header?.property_area_min_max },
    {
      icon: CalendarCheck2,
      label: "Last Updated",
      value:
        header?.property_last_updated &&
        new Date(header.property_last_updated).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
  ].filter((f) => f.value);

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col bg-ink">
      {/* ── Imagery ── */}
      <div className="absolute inset-0 overflow-hidden">
        {loading && <div className="skeleton-dark absolute inset-0" />}
        {desktop.map((img, i) => {
          const isActive = i === slide;
          const isFirst = i === 0;
          return (
            <picture key={img}>
              {mobile[i] && <source media="(max-width: 767px)" srcSet={mobile[i]} />}
              <img
                src={img}
                alt={i === 0 ? `${header?.property_name || "Property"} — exterior view` : ""}
                loading={isFirst ? "eager" : "lazy"}
                fetchpriority={isFirst ? "high" : "auto"}
                decoding={isFirst ? "sync" : "async"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
                  isActive ? "opacity-100" : "opacity-0"
                } ${isActive && !isFirst ? "animate-kenburns" : ""}`}
              />
            </picture>
          );
        })}
        {/* Cinematic scrim — keeps text legible without hiding the property */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-10 pt-28 sm:px-6 md:pb-16">
        <div className="max-w-3xl">
          {/* Trust chips */}
          <div className="animate-fade-up mb-5 flex flex-wrap items-center gap-2" style={{ animationDelay: "80ms" }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/40 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
              <BadgeCheck size={13} /> MahaRERA Registered
            </span>
            {header?.builder_name && (
              <span className="inline-flex items-center rounded-full border border-white/20 bg-ink/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory/85 backdrop-blur-sm">
                By {header.builder_name}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="skeleton-dark h-14 w-4/5 rounded-xl" />
              <div className="skeleton-dark h-5 w-2/5 rounded-lg" />
            </div>
          ) : (
            <>
              <h1
                className="animate-fade-up font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-ivory sm:text-6xl lg:text-7xl"
                style={{ animationDelay: "160ms" }}
              >
                {header?.hero_banner_heading || header?.property_name}
              </h1>
              {(header?.location || header?.sublocation) && (
                <p
                  className="animate-fade-up mt-4 flex items-center gap-2 text-base font-medium text-ivory/85 sm:text-lg"
                  style={{ animationDelay: "240ms" }}
                >
                  <MapPin size={18} className="shrink-0 text-gold" />
                  {[header?.sublocation, header?.location].filter(Boolean).join(", ")}
                </p>
              )}
            </>
          )}

          {/* CTAs */}
          <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
            <button onClick={() => openEnquiry("Book a Site Visit")} className="btn-gold">
              Book Free Site Visit
            </button>
            <button onClick={() => openEnquiry("Download Brochure")} className="btn-ghost">
              Download Brochure
            </button>
          </div>
        </div>

        {/* Floating glass fact bar — the "3D" layered depth moment */}
        {facts.length > 0 && (
          <div
            className="glass animate-fade-up mt-10 grid max-w-3xl grid-cols-1 divide-y divide-white/10 rounded-2xl shadow-deep sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            style={{ animationDelay: "420ms" }}
          >
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3.5 px-5 py-4">
                <Icon size={20} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.6} />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ivory/50">
                    {label}
                  </p>
                  <p className="text-sm font-semibold leading-snug text-ivory">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slide dots */}
        {count > 1 && (
          <div className="mt-8 flex gap-2">
            {desktop.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === slide ? "w-8 bg-gold" : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to overview"
        className="absolute bottom-6 right-6 z-10 hidden animate-float rounded-full border border-white/25 p-3 text-ivory/70 transition hover:border-gold hover:text-gold md:block"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
};

export default Hero;
