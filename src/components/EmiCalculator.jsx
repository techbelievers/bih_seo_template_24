import React, { useMemo, useState } from "react";
import { Calculator, TrendingUp, Wallet, PiggyBank, ClipboardCheck } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useEnquiry } from "../hooks/useEnquiry";

const inr = (n) =>
  isFinite(n)
    ? "₹" + Math.round(n).toLocaleString("en-IN")
    : "₹0";

const Field = ({ label, suffix, value, onChange, placeholder, min, max, step }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-stone">
      {label}
    </span>
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 pr-14 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-mist focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone">
          {suffix}
        </span>
      )}
    </div>
  </label>
);

/**
 * Home-loan EMI calculator. Pure client-side maths (no API); the "Get
 * Pre-Approved" CTA routes into the shared enquiry flow.
 */
const EmiCalculator = () => {
  const openEnquiry = useEnquiry();
  const [amount, setAmount] = useState("5000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const P = parseFloat(amount) || 0;
    const annual = parseFloat(rate) || 0;
    const n = (parseFloat(years) || 0) * 12;
    const r = annual / 12 / 100;
    if (P <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };
    const emiVal =
      r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emiVal * n;
    return { emi: emiVal, totalInterest: total - P, totalPayable: total };
  }, [amount, rate, years]);

  const principal = parseFloat(amount) || 0;
  const interestPct = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Plan Your Purchase"
          title="Home Loan EMI Calculator"
          sub="Estimate your monthly instalment and see how principal and interest add up — so you can plan with confidence."
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Why plan — dark panel */}
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-3xl bg-ink p-7 text-ivory shadow-deep md:p-10">
              <div>
                <h3 className="font-display text-2xl font-semibold text-ivory">Why plan your EMI?</h3>
                <ul className="mt-7 space-y-5">
                  {[
                    { icon: Wallet, t: "Know your monthly outflow before you shortlist a home." },
                    { icon: TrendingUp, t: "Compare tenures and see how interest adds up over time." },
                    { icon: PiggyBank, t: "Adjust amount, rate and tenure to find a plan that fits your budget." },
                  ].map(({ icon: Icon, t }, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                        <Icon size={18} strokeWidth={1.7} />
                      </span>
                      <span className="pt-1.5 text-sm leading-relaxed text-mist">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-8 text-xs leading-relaxed text-mist/70">
                Rates and eligibility depend on bank policies. Use this as an
                indicative estimate only.
              </p>
            </div>
          </Reveal>

          {/* Calculator */}
          <Reveal delay={120}>
            <div className="rounded-3xl border border-line bg-white p-7 shadow-float md:p-9">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 text-gold-deep">
                  <Calculator size={20} strokeWidth={1.7} />
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">Your loan details</h3>
              </div>

              <div className="space-y-4">
                <Field label="Loan amount" suffix="₹" value={amount} onChange={setAmount} placeholder="50,00,000" min="0" step="50000" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Interest rate" suffix="% p.a." value={rate} onChange={setRate} placeholder="8.5" min="0" max="20" step="0.05" />
                  <Field label="Tenure" suffix="yrs" value={years} onChange={setYears} placeholder="20" min="1" max="30" step="1" />
                </div>
              </div>

              {/* Result */}
              <div className="mt-7 rounded-2xl bg-ink p-6 text-center text-ivory">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">
                  Monthly EMI
                </p>
                <p className="mt-1 font-display text-4xl font-semibold text-gold">{inr(emi)}</p>

                {/* Principal vs interest bar */}
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                    style={{ width: `${Math.min(100, 100 - interestPct)}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mist">Principal</p>
                    <p className="text-sm font-semibold text-ivory">{inr(principal)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mist">Total Interest</p>
                    <p className="text-sm font-semibold text-ivory">{inr(totalInterest)}</p>
                  </div>
                  <div className="col-span-2 border-t border-white/10 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mist">Total Amount Payable</p>
                    <p className="text-lg font-semibold text-ivory">{inr(totalPayable)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openEnquiry("Home Loan Assistance")}
                className="btn-gold mt-5 w-full"
              >
                <ClipboardCheck size={17} /> Get Loan Assistance
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default EmiCalculator;
