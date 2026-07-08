import React, { useState } from "react";
import { ChevronDown, Building2 } from "lucide-react";
import useApi from "../hooks/useApi";
import Reveal from "./ui/Reveal";

/** Developer story — rendered from property_specification HTML. */
const AboutBuilder = () => {
  const { data, loading } = useApi("propert-details");
  const [open, setOpen] = useState(false);
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

        <Reveal delay={120} className="mt-10">
          <div className="relative">
            <div
              className="prose-luxe on-dark overflow-hidden text-center transition-[max-height] duration-700 ease-in-out"
              style={{ maxHeight: open ? "5000px" : "260px" }}
              dangerouslySetInnerHTML={{ __html: d.property_specification }}
            />
            {!open && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
            )}
          </div>
          <div className="mt-5 text-center">
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.16em] text-gold transition hover:text-gold-soft"
            >
              {open ? "Show Less" : "The Full Story"}
              <ChevronDown size={15} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutBuilder;
