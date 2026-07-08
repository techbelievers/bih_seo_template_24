import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, ArrowLeft, PhoneCall } from "lucide-react";
import useApi from "../hooks/useApi";
import { cleanPhone } from "../lib/phone";

const ThankYou = () => {
  const { data: header } = useApi("header");
  const { data: footer } = useApi("footer");
  const phone = cleanPhone(footer?.g_setting?.footer_phone || footer?.g_setting?.top_phone);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-20">
      <Helmet>
        <title>Thank You{header?.property_name ? ` — ${header.property_name}` : ""}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="animate-fade-up w-full max-w-lg rounded-3xl border border-line-dark bg-ink-soft p-10 text-center shadow-deep md:p-14">
        {header?.logo && (
          <img
            src={header.logo}
            alt={header?.property_name || "Logo"}
            className="mx-auto mb-8 h-12 object-contain"
          />
        )}

        <span className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <CheckCircle2 size={38} className="text-gold" strokeWidth={1.5} />
        </span>

        <h1 className="font-display text-3xl font-semibold text-ivory md:text-4xl">
          Thank You
        </h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-mist">
          Your enquiry has been received. A property advisor will contact you
          shortly with complete details
          {header?.property_name ? ` for ${header.property_name}` : ""}.
        </p>

        <div className="mt-10 space-y-3">
          <Link to="/" className="btn-gold w-full">
            <ArrowLeft size={16} /> Back to Property
          </Link>
          {phone && (
            <a href={`tel:${phone}`} className="btn-ghost w-full">
              <PhoneCall size={16} className="text-gold" /> Call Us Now
            </a>
          )}
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
