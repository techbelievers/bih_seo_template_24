import React, { useState } from "react";
import { Landmark, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/** How many logos to show on mobile before the "View More" toggle. */
const MOBILE_VISIBLE = 6;

/** Home-loan partners — quiet logo wall that signals institutional trust. */
const Banks = () => {
  const { data, loading } = useApi("banks");
  const [showAll, setShowAll] = useState(false);
  const banks = data?.bank?.banks || [];
  const heading = data?.bank?.page?.heading;

  if (!loading && banks.length === 0) return null;

  return (
    <section className="border-y border-line bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Home Loan Partners"
          title={heading || "Approved by Leading Banks"}
          sub="Pre-approved project — financing made effortless."
        />

        <div className="flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-4 md:gap-5">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-[88px] w-[104px] rounded-xl sm:h-24 sm:w-44 sm:rounded-2xl" />
            ))}

          {banks.map((bank, i) => (
            <Reveal
              key={bank.id}
              /* Desktop fits the full wall comfortably — only mobile collapses. */
              className={!showAll && i >= MOBILE_VISIBLE ? "hidden sm:block" : undefined}
            >
              <a
                href={bank.bank_slug}
                target="_blank"
                rel="noopener noreferrer"
                className="tilt-sm group flex h-full w-[104px] flex-col items-center justify-center gap-2 rounded-xl border border-line bg-white px-2 py-3 shadow-lift transition-colors hover:border-gold/50 sm:w-44 sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-6"
                title={bank.bank_name}
              >
                {bank.property_bank_photo ? (
                  <img
                    src={bank.property_bank_photo}
                    alt={bank.bank_name}
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-auto max-w-full object-contain grayscale transition duration-500 group-hover:grayscale-0 sm:h-10"
                  />
                ) : (
                  <Landmark size={20} className="text-gold-deep sm:size-[26px]" />
                )}
                <span className="flex items-center gap-1 text-center text-[10px] font-semibold leading-tight text-stone group-hover:text-ink sm:text-xs">
                  {bank.bank_name}
                  <ExternalLink size={10} className="hidden opacity-0 transition group-hover:opacity-60 sm:inline" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {banks.length > MOBILE_VISIBLE && (
          <div className="mt-6 text-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2.5 text-xs font-semibold text-stone shadow-lift transition-colors hover:border-gold/50 hover:text-ink"
            >
              {showAll ? "Show Less" : `View All ${banks.length} Banks`}
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Banks;
