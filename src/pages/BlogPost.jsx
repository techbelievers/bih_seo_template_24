import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { fetchApi } from "../lib/api";
import { useEnquiry } from "../hooks/useEnquiry";
import Img from "../components/ui/Img";

const readMins = (html = "") =>
  Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));

const BlogPost = () => {
  const { id } = useParams();
  const openEnquiry = useEnquiry();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    window.scrollTo(0, 0);
    fetchApi(`blogs/${id}`)
      .then((data) => active && setBlog(data.blogs?.[0] || null))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-cream">
      {blog && (
        <Helmet>
          <title>{blog.post_title}</title>
          <meta name="description" content={blog.post_content_short || blog.post_title} />
          <meta property="og:title" content={blog.post_title} />
          {blog.post_photo && <meta property="og:image" content={blog.post_photo} />}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: blog.post_title,
              image: blog.post_photo || undefined,
              datePublished: blog.created_at,
              description: blog.post_content_short || undefined,
            })}
          </script>
        </Helmet>
      )}

      {/* Slim header */}
      <div className="border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-stone transition hover:text-gold-deep"
          >
            <ArrowLeft size={16} /> Back to Property
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        {loading && (
          <div className="space-y-6">
            <div className="skeleton h-10 w-4/5 rounded-xl" />
            <div className="skeleton aspect-video rounded-3xl" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-4 rounded" style={{ width: `${96 - i * 5}%` }} />
            ))}
          </div>
        )}

        {!loading && (error || !blog) && (
          <div className="py-20 text-center">
            <h1 className="font-display text-3xl font-semibold text-ink">Article not found</h1>
            <p className="mt-3 text-stone">{error || "The story you're looking for isn't available."}</p>
            <Link to="/" className="btn-dark mt-8 inline-flex">
              Return Home
            </Link>
          </div>
        )}

        {!loading && blog && (
          <>
            <header>
              <p className="eyebrow mb-4">Journal</p>
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
                {blog.post_title}
              </h1>
              <div className="mt-5 flex items-center gap-6 text-sm font-semibold text-stone">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-gold-deep" />
                  {new Date(blog.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 size={14} className="text-gold-deep" />
                  {readMins(blog.post_content)} min read
                </span>
              </div>
            </header>

            {blog.post_photo && (
              <Img
                src={blog.post_photo}
                alt={blog.post_title}
                aspect="16/9"
                priority
                className="mt-10 rounded-3xl border border-line shadow-float"
              />
            )}

            <div
              className="prose-luxe mt-10 text-[17px]"
              dangerouslySetInnerHTML={{ __html: blog.post_content }}
            />

            {/* Conversion close */}
            <aside className="mt-16 rounded-3xl bg-ink p-8 text-center shadow-deep md:p-12">
              <h2 className="font-display text-2xl font-semibold text-ivory md:text-3xl">
                Interested in this property?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-mist">
                Speak to an advisor for current availability, pricing and site visits.
              </p>
              <button onClick={() => openEnquiry("Blog Enquiry")} className="btn-gold mt-7">
                Enquire Now
              </button>
            </aside>
          </>
        )}
      </article>
    </main>
  );
};

export default BlogPost;
