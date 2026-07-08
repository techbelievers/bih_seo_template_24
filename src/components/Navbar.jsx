import React, { useEffect, useState } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import useApi from "../hooks/useApi";
import { useEnquiry } from "../hooks/useEnquiry";
import { cleanPhone } from "../lib/phone";

const NAV_ITEMS = [
  { id: "about", label: "Overview" },
  { id: "price", label: "Pricing" },
  { id: "amenities", label: "Amenities" },
  { id: "gallery", label: "Gallery" },
  { id: "layouts", label: "Plans" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const { data: header, loading } = useApi("header");
  const { data: footer } = useApi("footer");
  const openEnquiry = useEnquiry();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  const phone = cleanPhone(footer?.g_setting?.footer_phone || footer?.g_setting?.top_phone);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — highlights the section in view
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-light shadow-lift" : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <a href="#home" className="flex min-w-0 items-center gap-3">
            {loading ? (
              <span className={`h-10 w-28 rounded-lg ${scrolled ? "skeleton" : "skeleton-dark"}`} />
            ) : (
              header?.logo && (
                <img
                  src={header.logo}
                  alt={header?.property_name || "Property logo"}
                  className="h-10 w-auto object-contain md:h-11"
                  width="120"
                  height="44"
                  decoding="async"
                />
              )
            )}
            <span
              className={`hidden truncate font-display text-lg font-semibold tracking-wide sm:block ${
                scrolled ? "text-ink" : "text-ivory"
              }`}
            >
              {header?.property_name}
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
                    active === item.id
                      ? "text-gold-deep"
                      : scrolled
                        ? "text-ink/70 hover:text-ink"
                        : "text-ivory/80 hover:text-ivory"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {phone && (
              <a
                href={`tel:${phone}`}
                className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition md:inline-flex ${
                  scrolled
                    ? "border-line text-ink hover:border-gold hover:text-gold-deep"
                    : "border-white/30 text-ivory hover:border-gold hover:text-gold"
                }`}
              >
                <Phone size={15} className="text-gold" />
                Call Now
              </a>
            )}
            <button
              onClick={() => openEnquiry("Book a Site Visit")}
              className="btn-gold hidden !px-5 !py-2.5 !text-[13px] md:inline-flex"
            >
              Book Site Visit
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`rounded-full p-2.5 transition lg:hidden ${
                scrolled ? "text-ink hover:bg-ink/5" : "text-ivory hover:bg-white/10"
              }`}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[90] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-ink text-ivory shadow-deep transition-transform duration-400 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line-dark p-5">
            {header?.logo && (
              <img src={header.logo} alt="" className="h-9 object-contain" loading="lazy" decoding="async" />
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 text-mist hover:bg-white/10 hover:text-ivory"
            >
              <X size={22} />
            </button>
          </div>

          <ul className="flex-1 space-y-1 overflow-y-auto p-5">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg tracking-wide text-ivory/90 transition hover:bg-white/5 hover:text-gold"
                >
                  {item.label}
                  <span className="text-xs text-gold-deep opacity-60">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-line-dark p-5">
            {header?.location && (
              <p className="flex items-center gap-2 text-sm text-mist">
                <MapPin size={15} className="text-gold" /> {header.location}
              </p>
            )}
            <button
              onClick={() => {
                setOpen(false);
                openEnquiry("Book a Site Visit");
              }}
              className="btn-gold w-full"
            >
              Book Site Visit
            </button>
            {phone && (
              <a href={`tel:${phone}`} className="btn-ghost w-full">
                <Phone size={16} className="text-gold" /> Call Now
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
