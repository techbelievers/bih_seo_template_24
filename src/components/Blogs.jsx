import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Img from "./ui/Img";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const readMins = (html = "") =>
  Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));

const BATCH = 6;

/** Insights — editorial featured story + clean card grid, SPA links. */
const Blogs = () => {
  const { data, loading } = useApi("blogs");
  const [shown, setShown] = useState(BATCH);
  const blogs = data?.blogs || [];

  if (!loading && blogs.length === 0) return null;

  const [featured, ...rest] = blogs;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Insights & Guides"
          title="From Our Journal"
          sub="Market intelligence, buyer guides and neighbourhood stories."
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured story */}
            {featured && (
              <Reveal>
                <Link
                  to={`/blogs/${featured.post_slug}`}
                  className="group mb-10 grid overflow-hidden rounded-3xl border border-line bg-white shadow-lift transition-all duration-500 hover:-translate-y-1 hover:shadow-float md:grid-cols-2"
                >
                  {/* No fixed aspect here: with a stretched grid row, aspect-ratio
                      would compute a width wider than the column and overlap the
                      text. Explicit heights + object-cover keep it contained. */}
                  <Img
                    src={featured.post_photo}
                    alt={featured.post_title}
                    className="h-56 w-full sm:h-72 md:h-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="flex min-w-0 flex-col justify-center p-7 md:p-12">
                    <p className="eyebrow mb-3">Featured</p>
                    <h3 className="font-display text-2xl font-semibold leading-snug text-ink transition-colors group-hover:text-gold-deep md:text-3xl">
                      {featured.post_title}
                    </h3>
                    <p className="mt-4 line-clamp-3 leading-relaxed text-stone">
                      {featured.post_content_short}
                    </p>
                    <div className="mt-6 flex items-center gap-5 text-xs font-semibold text-stone">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-gold-deep" />
                        {fmtDate(featured.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={13} className="text-gold-deep" />
                        {readMins(featured.post_content)} min read
                      </span>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-gold-deep">
                      Read Article
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, shown).map((blog, i) => (
                <Reveal key={blog.id} delay={(i % 3) * 90}>
                  <Link
                    to={`/blogs/${blog.post_slug}`}
                    className="tilt-sm group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
                  >
                    <Img
                      src={blog.post_photo}
                      alt={blog.post_title}
                      aspect="16/10"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-gold-deep">
                        {blog.post_title}
                      </h3>
                      <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-stone">
                        {blog.post_content_short}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs font-semibold text-stone">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={12} className="text-gold-deep" />
                          {fmtDate(blog.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={12} className="text-gold-deep" />
                          {readMins(blog.post_content)} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            {rest.length > shown && (
              <div className="mt-12 text-center">
                <button onClick={() => setShown((s) => s + BATCH)} className="btn-dark">
                  Load More Stories
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blogs;
