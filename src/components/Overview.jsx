import React from "react";
import { MapPin, Building2, Ruler, Layers, PhoneCall, FileDown } from "lucide-react";
import useApi from "../hooks/useApi";
import Reveal from "./ui/Reveal";
import Expandable from "./ui/Expandable";
import { useEnquiry } from "../hooks/useEnquiry";

const Overview = () => {
  const { data, loading } = useApi("propert-details");
  const openEnquiry = useEnquiry();
  const d = data?.property_details;

  const specs = [
    { icon: MapPin, label: "Location", value: d?.property_location_name },
    { icon: Building2, label: "Developer", value: d?.builder_name },
    { icon: Layers, label: "Configuration", value: d?.property_type_price_range || d?.property_type },
    { icon: Ruler, label: "Area Range", value: d?.property_price_range },
  ].filter((s) => s.value);

  return (
    <section id="about" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* ── Narrative ── */}
          <div className="min-w-0">
            <Reveal>
              <p className="eyebrow mb-4">The Residence</p>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
                {loading ? <span className="skeleton inline-block h-10 w-3/4 rounded-lg" /> : d?.property_name}
              </h2>
              <div className="mt-5 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
            </Reveal>

            <Reveal delay={120} className="mt-8">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton h-4 rounded" style={{ width: `${95 - i * 6}%` }} />
                  ))}
                </div>
              ) : (
                <Expandable html={d?.property_description} collapsedHeight={360} fadeFrom="from-cream" />
              )}
            </Reveal>
          </div>

          {/* ── Floating spec card ── */}
          <Reveal delay={200}>
            <aside className="tilt sticky top-24 rounded-3xl border border-line bg-white p-7 shadow-float md:p-8">
              <h3 className="font-display text-xl font-semibold text-ink">At a Glance</h3>
              {/* dl contains only <div> groups, each directly wrapping one
                  <dt> + <dd> — keeps the accessibility tree well-formed. */}
              <dl className="mt-6 space-y-5">
                {(loading ? [] : specs).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="border-b border-line pb-5 last:border-0 last:pb-0">
                    <dt className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-stone">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-deep">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>
                      {label}
                    </dt>
                    <dd className="mt-2 break-words pl-12 text-[15px] font-semibold leading-snug text-ink">
                      {value}
                    </dd>
                  </div>
                ))}
                {loading &&
                  [...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
              </dl>

              <div className="mt-7 space-y-3">
                <button onClick={() => openEnquiry("Download Brochure")} className="btn-gold w-full">
                  <FileDown size={17} /> Download Brochure
                </button>
                <button onClick={() => openEnquiry("Request a Callback")} className="btn-dark w-full">
                  <PhoneCall size={16} /> Request Callback
                </button>
              </div>
            </aside>
          </Reveal>
        </div>

        {/* ── Why choose — secondary narrative ── */}
        {d?.property_information && (
          <Reveal className="mt-16 md:mt-24">
            <div className="rounded-3xl bg-ink-soft p-7 shadow-deep sm:p-10 md:p-14">
              <p className="eyebrow mb-3">Why Choose {d?.property_name}</p>
              <h3 className="mb-8 font-display text-2xl font-semibold text-ivory md:text-4xl">
                A Considered Investment
              </h3>
              <Expandable html={d.property_information} dark collapsedHeight={320} fadeFrom="from-ink-soft" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default Overview;
