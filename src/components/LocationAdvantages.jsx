import React from "react";
import { MapPin, Navigation } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Img from "./ui/Img";

/**
 * Connectivity cards — image-led with a prominent distance badge.
 * Horizontal snap rail on mobile, grid on desktop.
 */
const LocationAdvantages = () => {
  const { data, loading } = useApi("location-advantages");
  const list = data?.location_advantages || [];
  const heading = data?.page?.[0]?.heading;

  if (!loading && list.length === 0) return null;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Connectivity"
          title={heading || "Location Advantages"}
          sub="Everything that matters — minutes away."
        />

        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-6">
          {loading &&
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-72 w-[78%] shrink-0 sm:w-auto">
                <div className="skeleton h-full rounded-3xl" />
              </div>
            ))}

          {list.map((item, i) => (
            <Reveal
              key={item.id ?? i}
              delay={(i % 3) * 90}
              className="w-[78%] shrink-0 snap-start sm:w-auto"
            >
              <article className="tilt group h-full overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <div className="relative">
                  <Img
                    src={item.location_image}
                    alt={`${item.location} — near the property`}
                    aspect="16/10"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3.5 py-1.5 text-xs font-bold text-gold backdrop-blur-sm">
                    <Navigation size={12} /> {item.distance}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="flex items-start gap-2 font-display text-xl font-semibold text-ink">
                    <MapPin size={17} className="mt-1 shrink-0 text-gold-deep" />
                    {item.location}
                  </h3>
                  {item.description && (
                    <p className="mt-2.5 text-sm leading-relaxed text-stone">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationAdvantages;
