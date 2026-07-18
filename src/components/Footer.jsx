import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram, Youtube, Twitter, Globe, Phone, ChevronUp } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import useApi from "../hooks/useApi";
import { cleanPhone } from "../lib/phone";

const SOCIAL_ICONS = {
  "fab fa-facebook-f": Facebook,
  "fab fa-linkedin-in": Linkedin,
  "fab fa-instagram": Instagram,
  "fab fa-youtube": Youtube,
  "fab fa-twitter": Twitter,
};

const LINKS = [
  { href: "#about", label: "Overview" },
  { href: "#price", label: "Pricing" },
  { href: "#gallery", label: "Gallery" },
  { href: "#layouts", label: "Plans" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => {
  const { data: footer, loading } = useApi("footer");
  const { data: reraData } = useApi("rera");

  if (loading) {
    return (
      <div className="bg-ink px-6 py-14">
        <div className="skeleton-dark mx-auto h-32 max-w-5xl rounded-2xl" />
      </div>
    );
  }
  if (!footer) return null;

  const { g_setting: g = {}, social_icons: socials = [] } = footer;
  const rera = reraData?.rera || [];
  const reraUrl = rera[0]?.rera_url || "https://maharera.maharashtra.gov.in/";
  const phone = cleanPhone(g.footer_phone || g.top_phone);

  return (
    <footer className="border-t border-line-dark bg-ink pb-28 pt-16 text-mist md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top: brand / links / contact / RERA QR */}
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_auto]">
          <div>
            {g.logo && (
              <img
                src={g.logo}
                alt="Brand logo"
                className="mb-5 h-14 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            )}
            <p className="max-w-xs text-sm leading-relaxed">
              Curated luxury residences, presented with verified information
              and complete transparency.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2.5">
                {socials.map((icon) => {
                  const Icon = SOCIAL_ICONS[icon.social_icon] || Globe;
                  return (
                    <a
                      key={icon.id}
                      href={icon.social_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${icon.social_icon?.replace("fab fa-", "") || "social"} page`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line-dark text-mist transition hover:border-gold hover:text-gold"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <nav aria-label="Footer navigation">
            <h4 className="mb-5 font-display text-base font-semibold tracking-wide text-ivory">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="transition hover:text-gold">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/privacy-policy" className="transition hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="mb-5 font-display text-base font-semibold tracking-wide text-ivory">
              Contact
            </h4>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2.5 text-sm transition hover:text-gold"
              >
                <Phone size={15} className="text-gold" /> {phone}
              </a>
            )}
            {g.footer_column_1_heading && g.footer_column_1_total_item && (
              <p className="mt-4 text-sm">
                {g.footer_column_1_heading}:{" "}
                <span className="text-gold">{g.footer_column_1_total_item}</span>
              </p>
            )}
          </div>

          {/* RERA verification */}
          <div className="text-center md:text-left">
            <h4 className="mb-5 font-display text-base font-semibold tracking-wide text-ivory">
              MahaRERA
            </h4>
            <div className="inline-block rounded-2xl bg-white p-2.5 shadow-lift">
              <QRCodeCanvas value={reraUrl} size={92} />
            </div>
            <div className="mt-4 space-y-1 text-xs leading-relaxed">
              {g.footer_agent_rera && <p>Agent: {g.footer_agent_rera}</p>}
              {rera.some((r) => r.rera_id) ? (
                rera
                  .filter((r) => r.rera_id)
                  .map((r) => <p key={r.id}>Project: {r.rera_id}</p>)
              ) : (
                <p>Project MahaRERA: Coming Soon</p>
              )}
              <a
                href={reraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gold-deep underline decoration-gold/40 underline-offset-2 transition hover:text-gold"
              >
                Verify on maharera.maharashtra.gov.in
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        {g.footer_disclamer && (
          <div className="mt-14 rounded-2xl border border-line-dark bg-ink-soft p-6 text-xs leading-relaxed text-mist/80">
            <strong className="mb-1.5 block font-semibold uppercase tracking-[0.14em] text-mist">
              Disclaimer
            </strong>
            {g.footer_disclamer}
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line-dark pt-7 text-xs sm:flex-row">
          <p>
            {g.footer_copyright ||
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-dark text-mist transition hover:border-gold hover:text-gold"
          >
            <ChevronUp size={17} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
