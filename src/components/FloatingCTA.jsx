import React, { useEffect, useState } from "react";
import { Phone, MessageCircle, CalendarCheck2 } from "lucide-react";
import useApi from "../hooks/useApi";
import { useEnquiry } from "../hooks/useEnquiry";
import { cleanPhone, waLink } from "../lib/phone";

/**
 * Always-in-reach conversion:
 *  - Mobile: sticky bottom action bar (Call / WhatsApp / Site Visit)
 *  - Desktop: floating WhatsApp orb
 * Appears after the hero so it never covers the first impression.
 */
const FloatingCTA = () => {
  const { data: header } = useApi("header");
  const { data: footer } = useApi("footer");
  const openEnquiry = useEnquiry();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = cleanPhone(footer?.g_setting?.footer_phone || footer?.g_setting?.top_phone);
  if (!phone) return null;

  const wa = waLink(phone, header?.property_name);

  return (
    <>
      {/* Desktop — WhatsApp orb */}
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`fixed bottom-7 right-7 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-deep transition-all duration-500 hover:scale-110 md:flex ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
      </a>

      {/* Mobile — sticky action bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-ink/95 backdrop-blur-md transition-transform duration-500 md:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-3">
          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center gap-1 py-3 text-ivory transition active:bg-white/5"
          >
            <Phone size={19} className="text-gold" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Call</span>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 border-x border-line-dark py-3 text-ivory transition active:bg-white/5"
          >
            <MessageCircle size={19} className="text-[#25D366]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp</span>
          </a>
          <button
            onClick={() => openEnquiry("Book a Site Visit")}
            className="flex flex-col items-center gap-1 bg-gradient-to-r from-gold-deep to-gold py-3 text-ink transition active:opacity-90"
          >
            <CalendarCheck2 size={19} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Site Visit</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingCTA;
