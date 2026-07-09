/**
 * Builds an llms.txt (https://llmstxt.org) from the API payloads captured
 * during prerender. Markdown with a single H1 + link sections so LLMs and
 * AI agents understand the site's structure and key facts.
 */

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const clamp = (str, n) => {
  const s = stripHtml(str);
  return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s;
};

export function buildLlmsTxt(apiData = {}, seo = {}) {
  const header = apiData.header || {};
  const details = apiData["propert-details"]?.property_details || {};
  const rera = apiData.rera?.rera || [];
  const blogs = apiData.blogs?.blogs || [];
  const gset = apiData.footer?.g_setting || {};

  const name =
    details.property_name || header.property_name || seo.title || "Property";
  const domain = (seo.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const base = domain ? `https://${domain}` : "";
  const url = (hash = "") => (base ? `${base}/${hash}` : hash || "/");

  const summary =
    clamp(details.seo_meta_description || seo.meta_description || header.hero_banner_subheading, 200) ||
    `${name} — a real estate project${
      details.property_location_name ? ` in ${details.property_location_name}` : ""
    }.`;

  const lines = [];
  lines.push(`# ${name}`);
  lines.push("");
  lines.push(`> ${summary}`);
  lines.push("");

  const intro = clamp(details.property_description, 500);
  if (intro) {
    lines.push(intro);
    lines.push("");
  }

  // Key facts
  const facts = [
    details.builder_name && `- Developer: ${details.builder_name}`,
    (details.property_location_name || header.location) &&
      `- Location: ${details.property_location_name || header.location}`,
    (details.property_type_price_range || header.property_type_price_range_text) &&
      `- Configuration: ${details.property_type_price_range || header.property_type_price_range_text}`,
    (details.property_price_range || header.property_area_min_max) &&
      `- Area: ${details.property_price_range || header.property_area_min_max}`,
    rera.length &&
      `- MahaRERA: ${rera.map((r) => r.rera_id).filter(Boolean).join(", ")}`,
    gset.footer_agent_rera && `- MahaRERA Agent: ${gset.footer_agent_rera}`,
  ].filter(Boolean);
  if (facts.length) {
    lines.push("## Key details");
    lines.push(...facts);
    lines.push("");
  }

  // Sections (all deep-linkable on a single page)
  lines.push("## Explore");
  const sections = [
    ["Overview", "#about", "Project overview and description"],
    ["Pricing", "#price", "Prices and configurations"],
    ["Amenities", "#amenities", "Lifestyle amenities"],
    ["Gallery", "#gallery", "Photo gallery"],
    ["Plans & Layouts", "#layouts", "Unit, floor and master plans"],
    ["Location", "#location", "Location map and connectivity"],
    ["Home Loan EMI Calculator", "#emi", "Estimate monthly EMI"],
    ["MahaRERA Information", "#rera", "Verified RERA registration details"],
    ["Contact", "#contact", "Enquire or book a site visit"],
  ];
  for (const [label, hash, desc] of sections) {
    lines.push(`- [${label}](${url(hash)}): ${desc}`);
  }
  lines.push("");

  // Articles
  if (blogs.length) {
    lines.push("## Articles");
    for (const b of blogs.slice(0, 25)) {
      const desc = clamp(b.post_content_short || b.post_title, 120);
      lines.push(`- [${b.post_title}](${url(`blogs/${b.post_slug}`)}): ${desc}`);
    }
    lines.push("");
  }

  // Contact
  const phone = gset.footer_phone || gset.top_phone;
  if (phone || base) {
    lines.push("## Contact");
    if (phone) lines.push(`- Phone: ${String(phone).replace(/[^\d+]/g, "")}`);
    if (base) lines.push(`- Website: ${url()}`);
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
