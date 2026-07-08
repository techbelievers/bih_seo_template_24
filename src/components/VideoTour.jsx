import React, { useState } from "react";
import { Play } from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/**
 * YouTube facade: renders only the thumbnail until the user clicks —
 * saves ~1MB+ of third-party JS on first load (major CWV win).
 */
const YouTubeFacade = ({ videoId, title, priorityThumb = false }) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group absolute inset-0 h-full w-full"
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        srcSet={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg 480w, https://img.youtube.com/vi/${videoId}/maxresdefault.jpg 1280w`}
        sizes="(max-width: 768px) 100vw, 900px"
        alt={title}
        loading={priorityThumb ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 bg-ink/60 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
          <Play size={26} className="ml-1 text-gold transition-colors group-hover:text-ink" fill="currentColor" />
        </span>
      </span>
    </button>
  );
};

const VideoTour = () => {
  const { data, loading } = useApi("video");
  const [active, setActive] = useState(0);
  const videos = data?.property_videos || [];
  const page = data?.page;

  if (!loading && videos.length === 0) return null;

  return (
    <section className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Walkthrough"
          title={page?.heading || "Virtual Tour"}
          sub={page?.subheading || "Experience the property from wherever you are."}
        />

        {loading ? (
          <div className="skeleton-dark aspect-video w-full rounded-3xl" />
        ) : (
          <>
            <Reveal>
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-line-dark shadow-deep">
                <YouTubeFacade
                  key={videos[active]?.youtube_video_id}
                  videoId={videos[active]?.youtube_video_id}
                  title={`${page?.heading || "Property video"} ${active + 1}`}
                />
              </div>
            </Reveal>

            {videos.length > 1 && (
              <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-1">
                {videos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActive(i)}
                    aria-label={`Play video ${i + 1}`}
                    className={`relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      i === active ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${v.youtube_video_id}/mqdefault.jpg`}
                      alt={`Video ${i + 1} thumbnail`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default VideoTour;
