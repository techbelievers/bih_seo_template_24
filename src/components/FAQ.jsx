import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").trim();

/**
 * FAQ accordion + auto-generated FAQPage JSON-LD — eligible for Google
 * rich results, a direct SEO ranking/CTR win.
 */
const FAQ = () => {
  const { data, loading } = useApi("faq");
  const [open, setOpen] = useState(0);
  const faqs = useMemo(() => data?.faqs || [], [data]);
  const heading = data?.page?.[0]?.heading;

  const schema = useMemo(() => {
    if (!faqs.length) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.faq_title,
        acceptedAnswer: { "@type": "Answer", text: stripHtml(f.faq_content) },
      })),
    });
  }, [faqs]);

  if (!loading && faqs.length === 0) return null;

  return (
    <section className="bg-ivory py-20 md:py-28">
      {schema && (
        <Helmet>
          <script type="application/ld+json">{schema}</script>
        </Helmet>
      )}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Good to Know"
          title={heading || "Frequently Asked Questions"}
        />

        <div className="space-y-3.5">
          {loading &&
            [...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}

          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.id} delay={i * 50}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen ? "border-gold/50 shadow-float" : "border-line shadow-lift"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <h3 className="font-display text-[17px] font-semibold leading-snug text-ink">
                      {faq.faq_title}
                    </h3>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-gold bg-gold text-ink"
                          : "border-line text-gold-deep"
                      }`}
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-400 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="prose-luxe px-6 pb-6 text-[15px]"
                        dangerouslySetInnerHTML={{ __html: faq.faq_content }}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
