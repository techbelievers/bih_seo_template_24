import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  ShieldCheck,
  BadgeCheck,
  ExternalLink,
  CalendarCheck2,
  Building2,
  Home,
  Ruler,
  ChevronDown,
} from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const MAHARERA_HOME = "https://maharera.maharashtra.gov.in/";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const fmtNum = (n) => (Number(n) > 0 ? Number(n).toLocaleString("en-IN") : null);

const ReraFact = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon size={15} className="mt-0.5 shrink-0 text-gold-deep" strokeWidth={1.7} />
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone">{label}</p>
      <p className="text-sm font-semibold leading-snug text-ink">{value}</p>
    </div>
  </div>
);

const ReraCard = ({ r }) => {
  const url = r.rera_url || MAHARERA_HOME;
  const facts = [
    { icon: CalendarCheck2, label: "Completion", value: fmtDate(r.completion_date) },
    fmtNum(r.total_tower) && { icon: Building2, label: "Towers", value: fmtNum(r.total_tower) },
    fmtNum(r.total_units) && { icon: Home, label: "Units", value: fmtNum(r.total_units) },
    fmtNum(r.total_area) && { icon: Ruler, label: "Area", value: `${fmtNum(r.total_area)} sq.m` },
  ].filter(Boolean);

  return (
    <article className="tilt-sm grid gap-6 rounded-3xl border border-line bg-white p-6 shadow-lift sm:grid-cols-[1fr_auto] sm:p-7">
      <div className="min-w-0">
        <h3 className="font-display text-xl font-semibold leading-snug text-ink">
          {r.phase_name || "Registered Phase"}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-stone">
            MahaRERA ID:{" "}
            <span className="font-semibold text-gold-deep">{r.rera_id}</span>
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink transition hover:border-gold hover:text-gold-deep"
          >
            Verify <ExternalLink size={11} />
          </a>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5 sm:grid-cols-4">
          {facts.map((f) => (
            <ReraFact key={f.label} icon={f.icon} label={f.label} value={f.value} />
          ))}
        </div>

        <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep">
          <BadgeCheck size={16} /> 100% MahaRERA Compliant
        </p>
      </div>

      {/* QR — scan to verify on the official portal */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-2 sm:border-l sm:border-line sm:pl-6">
        <div className="rounded-xl border border-line bg-white p-2">
          <QRCodeCanvas value={url} size={92} aria-label={`QR code to verify ${r.rera_id}`} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone">
          Scan to verify
        </span>
      </div>
    </article>
  );
};

/**
 * Full MahaRERA Information section — one verifiable card per registered
 * phase with QR + Verify link. Supports any number of RERA numbers, with
 * the extras behind a "Show more" toggle.
 */
const MahaReraSection = () => {
  const { data, loading } = useApi("rera");
  const [showAll, setShowAll] = useState(false);
  const rera = data?.rera || [];
  const heading = data?.page?.[0]?.heading;

  if (!loading && rera.length === 0) return null;

  const INITIAL = 2;
  const visible = showAll ? rera : rera.slice(0, INITIAL);
  const hiddenCount = rera.length - INITIAL;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Verified & Registered"
          title={heading || "MahaRERA Information"}
          sub="Every phase of this project is registered with MahaRERA. Scan or click to verify on the official government portal."
        />

        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-52 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {visible.map((r, i) => (
                <Reveal key={r.id} delay={(i % 2) * 90}>
                  <ReraCard r={r} />
                </Reveal>
              ))}
            </div>

            {hiddenCount > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  aria-expanded={showAll}
                  className="btn-dark"
                >
                  {showAll ? "Show Less" : `Show ${hiddenCount} More`}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}

            <Reveal className="mt-10 flex items-center justify-center gap-2 text-center">
              <ShieldCheck size={15} className="text-gold-deep" />
              <p className="text-xs text-stone">
                MahaRERA registration does not constitute a guarantee of returns;
                please verify all details on the official portal.
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
};

export default MahaReraSection;
