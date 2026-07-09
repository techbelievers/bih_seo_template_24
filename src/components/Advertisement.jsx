import React from "react";
import { ExternalLink } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Img from "./ui/Img";

/** Featured partner banners — renders nothing when no ads are configured. */
const Advertisement = () => {
  const { data, loading } = useApi("advertisement");
  const contact = data?.contact_us || {};
  const page = data?.page?.[0];

  const ads =
    contact.above_category_status === "Show"
      ? [
          contact.above_category_1 &&
            contact.above_category_1_url && {
              id: 1,
              image: contact.above_category_1,
              url: contact.above_category_1_url,
            },
          contact.above_category_2 &&
            contact.above_category_2_url && {
              id: 2,
              image: contact.above_category_2,
              url: contact.above_category_2_url,
            },
        ].filter(Boolean)
      : [];

  if (loading || ads.length === 0) return null;

  return (
    <section aria-label="Featured partners" className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Featured" title={page?.heading || "Featured Partners"} sub={page?.subheading} />
        <div className={`grid gap-6 ${ads.length > 1 ? "md:grid-cols-2" : "justify-center"}`}>
          {ads.map((ad) => (
            <Reveal key={ad.id}>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-3xl border border-line shadow-lift transition-all duration-500 hover:-translate-y-1 hover:shadow-float"
              >
                <Img
                  src={ad.image}
                  alt={`${page?.heading || "Featured partner"} ${ad.id}`}
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.03] !h-auto"
                  className="[&>img]:w-full"
                />
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-gold opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <ExternalLink size={15} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisement;
