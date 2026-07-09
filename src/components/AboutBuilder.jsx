import React from "react";
import { Building2 } from "lucide-react";
import useApi from "../hooks/useApi";
import Reveal from "./ui/Reveal";
import Expandable from "./ui/Expandable";

/** Developer story — rendered from property_specification HTML. */
const AboutBuilder = () => {
  const { data, loading } = useApi("propert-details");
  const d = data?.property_details;

  if (loading || !d?.property_specification) return null;

  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/8 text-gold">
            <Building2 size={24} strokeWidth={1.5} />
          </span>
          <p className="eyebrow hairline justify-center mb-4">The Developer</p>
          <h2 className="font-display text-3xl font-semibold text-ivory md:text-5xl">
            {d?.builder_name}
          </h2>
        </Reveal>

        {/* Body is left-aligned prose (bulleted lists read correctly);
            Expandable measures real height so nothing is cut off. */}
        <Reveal delay={120} className="mt-10">
          <Expandable
            html={d.property_specification}
            dark
            collapsedHeight={300}
            fadeFrom="from-ink"
            moreLabel="The Full Story"
            lessLabel="Show Less"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default AboutBuilder;
