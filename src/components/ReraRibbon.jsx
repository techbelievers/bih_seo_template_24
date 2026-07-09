import React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";
import useApi from "../hooks/useApi";
import Reveal from "./ui/Reveal";

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-IN") : n);

/**
 * Trust ribbon under the hero: headline project numbers in large serif
 * plus verifiable MahaRERA registration chips per phase.
 */
const ReraRibbon = () => {
  const { data, loading } = useApi("rera");
  const rera = data?.rera || [];

  if (!loading && rera.length === 0) return null;

  const sum = (key) => rera.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
  const totalArea = sum("total_area");
  const totalUnits = sum("total_units");
  const totalTowers = sum("total_tower");
  const possession = rera
    .map((r) => r.completion_date)
    .filter(Boolean)
    .sort()
    .pop();

  const stats = [
    totalArea > 0 && { label: "Total Area", value: `${fmt(totalArea)} sq.m` },
    sum("total_acre") > 0 && { label: "Land Parcel", value: `${sum("total_acre").toFixed(2)} Acres` },
    totalTowers > 0 && { label: "Towers", value: fmt(totalTowers) },
    totalUnits > 0 && { label: "Units", value: fmt(totalUnits) },
    possession && {
      label: "Possession",
      value: new Date(possession).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    },
  ].filter(Boolean);

  return (
    <section aria-label="Project facts and RERA registration" className="border-b border-line-dark bg-ink-soft">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-dark h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {stats.length > 0 && (
              <Reveal>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-8 text-center md:flex md:justify-around">
                  {stats.map((s) => (
                    // flex-col-reverse keeps the value visually on top while
                    // dt precedes dd in the DOM (well-formed a11y tree).
                    <div key={s.label} className="flex flex-col-reverse">
                      <dt className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
                        {s.label}
                      </dt>
                      <dd className="font-display text-2xl font-semibold text-gold-sheen text-gold md:text-4xl">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 border-t border-line-dark pt-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                  <ShieldCheck size={14} /> MahaRERA
                </span>
                {rera.map((r) => (
                  <a
                    key={r.id}
                    href={r.rera_url || "https://maharera.maharashtra.gov.in/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 rounded-full border border-line-dark bg-ink px-3.5 py-1.5 text-xs font-medium text-mist transition hover:border-gold/50 hover:text-ivory"
                    title={r.phase_name}
                  >
                    {r.rera_id}
                    <ExternalLink size={11} className="opacity-50 transition group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
};

export default ReraRibbon;
