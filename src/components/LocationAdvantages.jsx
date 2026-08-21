import React, { useState } from "react";
import { MapPin, Navigation, ChevronDown } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Img from "./ui/Img";

const INITIAL = 10;

/**
 * Connectivity tiles — compact logo-wall scale, matching the bank tiles, so the
 * section reads as a quick landmark index rather than a photo gallery.
 */
const LocationAdvantages = () => {
  const { data, loading } = useApi("location-advantages");
  const [showAll, setShowAll] = useState(false);
  const list = data?.location_advantages || [];
  const heading = data?.page?.[0]?.heading;

  if (!loading && list.length === 0) return null;

  const visible = showAll ? list : list.slice(0, INITIAL);

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Connectivity"
          title={heading || "Location Advantages"}
          sub="Everything that matters — minutes away."
        />

        <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4 md:gap-5">
          {loading &&
            [...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-[150px] w-[136px] rounded-xl sm:h-[170px] sm:w-44 sm:rounded-2xl" />
            ))}

          {visible.map((item, i) => (
            <Reveal key={item.id ?? i} delay={(i % 5) * 60}>
              <article className="tilt-sm group flex h-full w-[136px] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-lift transition-colors hover:border-gold/50 sm:w-44 sm:rounded-2xl">
                <div className="relative">
                  <Img
                    src={item.location_image}
                    alt={`${item.location} — near the property`}
                    aspect="16/10"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-ink/85 px-2 py-0.5 text-[10px] font-bold text-gold backdrop-blur-sm">
                    <Navigation size={10} /> {item.distance}
                  </span>
                </div>
                <div className="flex flex-1 items-start gap-1.5 px-2.5 py-2.5 sm:px-3">
                  <MapPin size={12} className="mt-[3px] shrink-0 text-gold-deep" />
                  <h3 className="text-[11px] font-semibold leading-tight text-ink sm:text-xs">
                    {item.location}
                  </h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {!loading && list.length > INITIAL && (
          <div className="mt-10 text-center">
            <button onClick={() => setShowAll((s) => !s)} aria-expanded={showAll} className="btn-dark">
              {showAll ? "View Less" : `View All ${list.length} Landmarks`}
              <ChevronDown size={15} className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationAdvantages;
