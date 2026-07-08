import React, { useMemo, useState } from "react";
import { ArrowRight, Ruler, Building } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useEnquiry } from "../hooks/useEnquiry";

/**
 * Pricing as luxury cards: serif price, clean specs, one clear CTA per
 * configuration. Filter chips replace the old search + view toggles.
 */
const Prices = () => {
  const { data, loading } = useApi("property-prices");
  const openEnquiry = useEnquiry();
  const [filter, setFilter] = useState("All");

  const prices = useMemo(() => data?.property_prices || [], [data]);
  const page = data?.page?.[0];

  const types = useMemo(
    () => ["All", ...new Set(prices.map((p) => p.property_type).filter(Boolean))],
    [prices]
  );
  const visible = filter === "All" ? prices : prices.filter((p) => p.property_type === filter);

  if (!loading && prices.length === 0) return null;

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Investment"
          title={page?.heading || "Pricing & Configurations"}
          sub={page?.subheading}
        />

        {/* Filter chips */}
        {types.length > 2 && (
          <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-full px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all duration-300 ${
                  filter === t
                    ? "bg-ink text-ivory shadow-lift"
                    : "border border-line bg-white text-stone hover:border-gold hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {loading &&
            [...Array(3)].map((_, i) => <div key={i} className="skeleton h-72 rounded-3xl" />)}

          {visible.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <article className="tilt group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-lift md:p-8">
                {/* Gold top accent */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold-deep via-gold to-gold-soft" />

                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-ink">
                      {p.property_type}
                    </h3>
                    {p.property_tower && p.property_tower !== "0" && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-stone">
                        <Building size={13} className="text-gold-deep" /> Tower {p.property_tower}
                      </p>
                    )}
                  </div>
                  {p.price_tag && (
                    <span className="shrink-0 rounded-full bg-gold/12 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-deep">
                      {p.price_tag}
                    </span>
                  )}
                </div>

                <div className="space-y-3 border-y border-line py-5 text-sm">
                  {p.property_carpet_sqft && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-stone">
                        <Ruler size={14} className="text-gold-deep" /> Carpet Area
                      </span>
                      <span className="font-semibold text-ink">
                        {Number(p.property_carpet_sqft).toLocaleString("en-IN")} sq.ft
                      </span>
                    </div>
                  )}
                  {p.property_carpet_sqm && (
                    <div className="flex items-center justify-between">
                      <span className="pl-6 text-stone">Equivalent</span>
                      <span className="font-medium text-stone">
                        {Number(p.property_carpet_sqm).toFixed(1)} sq.m
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-1 items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone">Price</p>
                    <p className="font-display text-3xl font-semibold text-ink">
                      ₹{p.property_price}
                      <span className="ml-1 text-lg text-gold-deep">{p.price_unit}*</span>
                    </p>
                  </div>
                  <button
                    onClick={() => openEnquiry(`Price Enquiry — ${p.property_type} (${p.property_carpet_sqft} sq.ft)`)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-ivory transition-all duration-300 group-hover:bg-gold-deep group-hover:shadow-gold"
                  >
                    Enquire <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-xs text-stone">
            *Prices are indicative and subject to change without prior notice.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Prices;
