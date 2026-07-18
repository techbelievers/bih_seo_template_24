import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { EnquiryProvider } from "./context/EnquiryContext";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import FloatingCTA from "./components/FloatingCTA";

// Build-time SEO data (also injected into index.html by vite-plugin-html)
import seoData from "../public/seodata.json";

// Secondary routes are code-split — they never weigh down the home page
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-cream">
    <div className="skeleton h-24 w-24 rounded-full" />
  </div>
);

/**
 * Sections below the fold mount lazily, so an anchor target can shift
 * after the browser's native jump. Re-align to the hash target once
 * the late-mounted content has settled.
 */
const HashScrollFix = () => {
  useEffect(() => {
    const settle = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      let attempts = 0;
      const tick = () => {
        const el = document.getElementById(id);
        if (el && Math.abs(el.getBoundingClientRect().top - 84) > 70) {
          el.scrollIntoView({ behavior: "auto" });
        }
        if (++attempts < 6) setTimeout(tick, 700);
      };
      setTimeout(tick, 400);
    };
    window.addEventListener("hashchange", settle);
    settle();
    return () => window.removeEventListener("hashchange", settle);
  }, []);
  return null;
};

function App() {
  const seo = seoData?.data || {};
  return (
    <HelmetProvider>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.meta_description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        <meta property="og:title" content={seo.og_title || seo.title} />
        <meta property="og:description" content={seo.og_description || seo.meta_description} />
        {seo.og_image && <meta property="og:image" content={seo.og_image} />}
        <meta property="og:type" content={seo.og_type || "website"} />
        {seo.domain && <meta property="og:url" content={`https://${seo.domain}/`} />}
        <meta name="twitter:card" content="summary_large_image" />
        {seo.favicon && <link rel="icon" href={seo.favicon} />}
        {seo.domain && <link rel="canonical" href={`https://${seo.domain}/`} />}
        {seo.script_1 && <script type="application/ld+json">{seo.script_1}</script>}
        {seo.script_2 && <script type="application/ld+json">{seo.script_2}</script>}
      </Helmet>

      <Router>
        <HashScrollFix />
        <EnquiryProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blogs/:id" element={<BlogPost />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
          <FloatingCTA />
          <Footer />
        </EnquiryProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
