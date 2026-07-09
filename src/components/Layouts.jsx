import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, X, Ruler, Tag as TagIcon } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Img from "./ui/Img";
import { useEnquiry } from "../hooks/useEnquiry";

const TABS = [
  { key: "unit", label: "Unit Plans" },
  { key: "floor", label: "Floor Plans" },
  { key: "master", label: "Master Plan" },
];

/** Unit / floor / master plans — three cached parallel fetches, one viewer. */
const Layouts = () => {
  const unit = useApi("unit-layout");
  const floor = useApi("floor-layout");
  const master = useApi("master-layout");
  const openEnquiry = useEnquiry();

  const [tab, setTab] = useState("unit");
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState(null);

  const datasets = {
    unit: { list: unit.data?.unit_layout || [], page: unit.data?.page?.[0] },
    floor: { list: floor.data?.Floor_plans || [], page: floor.data?.page?.[0] },
    master: { list: master.data?.master_layout || [], page: master.data?.page?.[0] },
  };
  const loading = unit.loading || floor.loading || master.loading;
  const tabs = TABS.filter((t) => datasets[t.key].list.length > 0);
  const activeKey = datasets[tab]?.list.length ? tab : tabs[0]?.key;
  const active = activeKey ? datasets[activeKey] : null;
  const layouts = active?.list || [];
  const current = layouts[Math.min(slide, layouts.length - 1)];

  if (!loading && tabs.length === 0) return null;

  const go = (dir) =>
    setSlide((s) => (s + dir + layouts.length) % layouts.length);

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Blueprints"
          title={active?.page?.heading || "Plans & Layouts"}
          sub="Thoughtfully planned spaces — explore unit, floor and master layouts."
        />

        {/* Tabs */}
        {tabs.length > 1 && (
          <Reveal className="mb-10 flex justify-center">
            <div className="inline-flex rounded-full border border-line bg-white p-1.5 shadow-lift">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setSlide(0);
                  }}
                  className={`rounded-full px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all duration-300 sm:px-7 ${
                    activeKey === t.key ? "bg-ink text-ivory shadow-lift" : "text-stone hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="skeleton h-96 rounded-3xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-2/3 rounded-lg" />
              <div className="skeleton h-20 rounded-2xl" />
              <div className="skeleton h-20 rounded-2xl" />
            </div>
          </div>
        ) : (
          current && (
            <Reveal>
              <div className="grid items-center gap-8 rounded-3xl border border-line bg-white p-5 shadow-float sm:p-8 md:grid-cols-2 md:gap-12">
                {/* Plan image — min-w-0 lets the grid column shrink on
                    mobile so wide plan images never overflow the viewport. */}
                <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-line bg-ivory">
                  <Img
                    key={current.layout_image}
                    src={current.layout_image}
                    alt={`${current.layout_name || "Layout"} — ${activeKey} plan`}
                    aspect="4/3"
                    imgClassName="!object-contain p-3"
                  />
                  <button
                    onClick={() => setZoom(current.layout_image)}
                    aria-label="Expand layout image"
                    className="absolute right-3 top-3 rounded-full bg-ink/80 p-2.5 text-gold backdrop-blur transition hover:bg-ink"
                  >
                    <Expand size={16} />
                  </button>
                  {layouts.length > 1 && (
                    <>
                      <button
                        onClick={() => go(-1)}
                        aria-label="Previous layout"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/80 p-2.5 text-ivory backdrop-blur transition hover:bg-ink hover:text-gold"
                      >
                        <ChevronLeft size={17} />
                      </button>
                      <button
                        onClick={() => go(1)}
                        aria-label="Next layout"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/80 p-2.5 text-ivory backdrop-blur transition hover:bg-ink hover:text-gold"
                      >
                        <ChevronRight size={17} />
                      </button>
                    </>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <p className="eyebrow mb-2">
                    {slide + 1} / {layouts.length}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-ink break-words sm:text-3xl">
                    {current.layout_name}
                  </h3>

                  <div className="mt-7 space-y-4">
                    {current.unit_layout_carpet_area && (
                      <div className="flex items-center gap-4 rounded-2xl border border-line bg-ivory px-5 py-4">
                        <Ruler size={19} className="shrink-0 text-gold-deep" strokeWidth={1.7} />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone">Carpet Area</p>
                          <p className="font-semibold text-ink">{current.unit_layout_carpet_area}</p>
                        </div>
                      </div>
                    )}
                    {current.unit_layout_price && (
                      <div className="flex items-center gap-4 rounded-2xl border border-line bg-ivory px-5 py-4">
                        <TagIcon size={19} className="shrink-0 text-gold-deep" strokeWidth={1.7} />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone">Price</p>
                          <p className="font-semibold text-ink">₹ {current.unit_layout_price}*</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openEnquiry(`Layout Enquiry — ${current.layout_name}`)}
                    className="btn-gold mt-8"
                  >
                    Get Costing Details
                  </button>

                  {/* Thumbnail rail */}
                  {layouts.length > 1 && (
                    <div className="no-scrollbar mt-8 flex gap-2.5 overflow-x-auto pb-1">
                      {layouts.map((l, i) => (
                        <button
                          key={l.id ?? i}
                          onClick={() => setSlide(i)}
                          aria-label={`Show ${l.layout_name}`}
                          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                            i === slide
                              ? "border-gold bg-gold/10 text-gold-deep"
                              : "border-line bg-white text-stone hover:border-gold/50"
                          }`}
                        >
                          {l.layout_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )
        )}
      </div>

      {/* Zoom modal */}
      {zoom &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
            onClick={() => setZoom(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Layout viewer"
          >
            <button
              aria-label="Close viewer"
              className="absolute right-4 top-4 rounded-full border border-white/20 p-2.5 text-ivory hover:border-gold hover:text-gold"
            >
              <X size={20} />
            </button>
            <img
              src={zoom}
              alt="Expanded layout plan"
              className="max-h-[90vh] max-w-full rounded-xl bg-white object-contain shadow-deep"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </section>
  );
};

export default Layouts;
