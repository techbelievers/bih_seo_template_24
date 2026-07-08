import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Clock3, ShieldCheck, Send, Loader2, AlertCircle } from "lucide-react";
import useApi from "../hooks/useApi";
import { postEnquiry } from "../lib/api";
import { cleanPhone, waLink } from "../lib/phone";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const inputBase =
  "w-full rounded-xl border border-line-dark bg-ink px-4 py-3.5 text-sm text-ivory placeholder:text-mist/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition";

/** Closing conversion section: inline form + direct channels. */
const ContactSection = () => {
  const navigate = useNavigate();
  const { data: header } = useApi("header");
  const { data: footer } = useApi("footer");
  const phone = cleanPhone(footer?.g_setting?.footer_phone || footer?.g_setting?.top_phone);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!form.first_name.trim()) er.first_name = "Required";
    if (!form.last_name.trim()) er.last_name = "Required";
    if (!/^[0-9]{10}$/.test(form.phone_number.trim()))
      er.phone_number = "Enter a valid 10-digit number";
    if (Object.keys(er).length) return setErrors(er);

    setSubmitting(true);
    setError("");
    try {
      await postEnquiry(form);
      navigate("/thank-you");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-ink-soft py-20 md:py-28">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-gold/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Pitch + channels ── */}
          <div>
            <SectionHeading
              dark
              align="left"
              eyebrow="Private Consultation"
              title="Speak With Our Property Advisors"
              sub={`Get the latest availability, pricing and offers for ${
                header?.property_name || "this property"
              } — typically within 10 minutes.`}
            />

            <Reveal delay={100} className="space-y-4">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="tilt-sm flex items-center gap-4 rounded-2xl border border-line-dark bg-ink p-5 transition-colors hover:border-gold/50"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Phone size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">Call Us Directly</p>
                    <p className="font-display text-lg font-semibold text-ivory">{phone}</p>
                  </div>
                </a>
              )}
              {phone && (
                <a
                  href={waLink(phone, header?.property_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tilt-sm flex items-center gap-4 rounded-2xl border border-line-dark bg-ink p-5 transition-colors hover:border-gold/50"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <MessageCircle size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">WhatsApp</p>
                    <p className="font-display text-lg font-semibold text-ivory">Chat Instantly</p>
                  </div>
                </a>
              )}
              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-3 text-sm text-mist">
                <span className="flex items-center gap-2">
                  <Clock3 size={15} className="text-gold" /> Response within minutes
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-gold" /> No spam, ever
                </span>
              </div>
            </Reveal>
          </div>

          {/* ── Form card ── */}
          <Reveal delay={150}>
            <form
              onSubmit={submit}
              noValidate
              className="rounded-3xl border border-line-dark bg-ink p-7 shadow-deep md:p-9"
            >
              <h3 className="font-display text-2xl font-semibold text-ivory">Request a Call Back</h3>
              <p className="mb-7 mt-1.5 text-sm text-mist">
                Share your details — an advisor will reach out shortly.
              </p>

              {error && (
                <p className="mb-5 flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle size={16} /> {error}
                </p>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  {["first_name", "last_name"].map((f) => (
                    <div key={f}>
                      <input
                        name={f}
                        value={form[f]}
                        onChange={set}
                        placeholder={f === "first_name" ? "First name*" : "Last name*"}
                        autoComplete={f === "first_name" ? "given-name" : "family-name"}
                        className={`${inputBase} ${errors[f] ? "border-red-400" : ""}`}
                      />
                      {errors[f] && <p className="mt-1 text-xs text-red-400">{errors[f]}</p>}
                    </div>
                  ))}
                </div>
                <div>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={set}
                    placeholder="10-digit mobile number*"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                    className={`${inputBase} ${errors.phone_number ? "border-red-400" : ""}`}
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone_number}</p>
                  )}
                </div>
                <input
                  type="email"
                  name="email_id"
                  value={form.email_id}
                  onChange={set}
                  placeholder="Email (optional)"
                  autoComplete="email"
                  className={inputBase}
                />
                <textarea
                  name="message"
                  rows="3"
                  value={form.message}
                  onChange={set}
                  placeholder="I'd like to know more about…"
                  className={`${inputBase} resize-none`}
                />
                <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-70">
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Get in Touch
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
