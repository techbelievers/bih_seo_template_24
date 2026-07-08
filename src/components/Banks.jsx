import React from "react";
import { Landmark, ExternalLink } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/** Home-loan partners — quiet logo wall that signals institutional trust. */
const Banks = () => {
  const { data, loading } = useApi("banks");
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

        <div className="flex flex-wrap items-stretch justify-center gap-4 md:gap-5">
          {loading &&
            [...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 w-44 rounded-2xl" />)}

          {banks.map((bank, i) => (
            <Reveal key={bank.id} delay={(i % 4) * 70}>
              <a
                href={bank.bank_slug}
                target="_blank"
                rel="noopener noreferrer"
                className="tilt-sm group flex h-full w-40 flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white px-5 py-6 shadow-lift transition-colors hover:border-gold/50 sm:w-44"
                title={bank.bank_name}
              >
                {bank.property_bank_photo ? (
                  <img
                    src={bank.property_bank_photo}
                    alt={bank.bank_name}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-auto max-w-full object-contain grayscale transition duration-500 group-hover:grayscale-0"
                  />
                ) : (
                  <Landmark size={26} className="text-gold-deep" />
                )}
                <span className="flex items-center gap-1 text-center text-xs font-semibold leading-tight text-stone group-hover:text-ink">
                  {bank.bank_name}
                  <ExternalLink size={10} className="opacity-0 transition group-hover:opacity-60" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banks;
