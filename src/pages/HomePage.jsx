import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ReraRibbon from "../components/ReraRibbon";
import Overview from "../components/Overview";
import LazySection from "../components/ui/LazySection";
import Prices from "../components/Prices";
import Advertisement from "../components/Advertisement";
import Amenities from "../components/Amenities";
import Gallery from "../components/Gallery";
import VideoTour from "../components/VideoTour";
import Layouts from "../components/Layouts";
import LocationAdvantages from "../components/LocationAdvantages";
import LocationMap from "../components/LocationMap";
import Banks from "../components/Banks";
import AboutBuilder from "../components/AboutBuilder";
import Blogs from "../components/Blogs";
import FAQ from "../components/FAQ";
import ContactSection from "../components/ContactSection";

/**
 * Everything below Overview is lazy-mounted: it renders (and fetches)
 * only as the visitor approaches it, keeping first paint featherweight.
 * The anchor ids live on the always-present wrappers so #links work.
 */
const HomePage = () => (
  <main>
    <Navbar />
    <Hero />
    <ReraRibbon />
    <Overview />
    <LazySection anchor="price" minHeight={820}><Prices /></LazySection>
    <LazySection minHeight={0}><Advertisement /></LazySection>
    <LazySection anchor="amenities" minHeight={760}><Amenities /></LazySection>
    <LazySection anchor="gallery" minHeight={900}><Gallery /></LazySection>
    <LazySection anchor="video" minHeight={0}><VideoTour /></LazySection>
    <LazySection anchor="layouts" minHeight={820}><Layouts /></LazySection>
    <LazySection anchor="connectivity" minHeight={700}><LocationAdvantages /></LazySection>
    <LazySection anchor="location" minHeight={760}><LocationMap /></LazySection>
    <LazySection anchor="banks" minHeight={0}><Banks /></LazySection>
    <LazySection anchor="about-builder" minHeight={0}><AboutBuilder /></LazySection>
    <LazySection anchor="blogs" minHeight={0}><Blogs /></LazySection>
    <LazySection anchor="faq" minHeight={0}><FAQ /></LazySection>
    <LazySection anchor="contact" minHeight={760}><ContactSection /></LazySection>
  </main>
);

export default HomePage;
