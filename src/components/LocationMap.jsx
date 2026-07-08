import React from "react";
import { MapPin } from "lucide-react";
import useApi from "../hooks/useApi";
import useInView, { isPrerender } from "../hooks/useInView";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useEnquiry } from "../hooks/useEnquiry";

/**
 * Google Map embed, injected only when scrolled near (the iframe alone
 * costs ~0.5MB — never let it touch first load).
 */
const LocationMap = () => {
  const { data, loading } = useApi("location-map");
  const openEnquiry = useEnquiry();
  const [ref, nearViewport] = useInView("600px 0px 600px 0px");

  if (!loading && !data?.map) return null;

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Find Us"
          title={data?.heading || "Location Map"}
          sub={data?.subheading}
        />

        <Reveal>
          <div
            ref={ref}
            className="map-embed relative h-[380px] overflow-hidden rounded-3xl border border-line shadow-float md:h-[500px]"
          >
            {/* Keep the heavy iframe out of the prerendered snapshot —
                it would load for every real visitor's first paint. */}
            {nearViewport && !isPrerender() && data?.map ? (
              <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: data.map }} />
            ) : (
              <div className="skeleton flex h-full w-full items-center justify-center">
                <MapPin size={32} className="text-gold-deep" />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <button onClick={() => openEnquiry("Schedule a Site Visit")} className="btn-dark">
            <MapPin size={16} className="text-gold" /> Schedule a Guided Visit
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default LocationMap;
