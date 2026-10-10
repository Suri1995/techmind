"use client";

import { useCallback, useEffect, useState, type KeyboardEvent, type MouseEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import type { Client } from "@/lib/data";
import ClientCard from "./ClientCard";
import { IconArrowRight } from "./icons";

/** Opens a client's website in a new tab. Used only when `client.website` is set. */
function openSite(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Draggable, snap-aligned carousel with a progress rail. */
export default function ClientCarousel({ clients }: { clients: Client[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [dragging, setDragging] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial sync with the embla instance
    update();
    emblaApi.on("scroll", update).on("reInit", update).on("select", update);
    emblaApi.on("pointerDown", () => setDragging(true));
    emblaApi.on("pointerUp", () => setDragging(false));
    return () => {
      emblaApi.off("scroll", update).off("reInit", update).off("select", update);
    };
  }, [emblaApi, update]);

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-teal-deep hover:text-teal-deep disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-soft";

  return (
    <div onKeyDown={(e) => { if (e.key === "ArrowRight") emblaApi?.scrollNext(); if (e.key === "ArrowLeft") emblaApi?.scrollPrev(); }}>
      <div
        className={`overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        ref={emblaRef}
        aria-roledescription="carousel"
        aria-label="Client partnerships"
      >
        <div className="flex gap-6 pb-4 pr-6">
          {clients.map((client, i) => {
            const site = client.website;

            // Only clients with a website are clickable. A drag never counts as a
            // click (Embla suppresses the click that follows a drag), and clicks on
            // links/buttons inside the card keep their own behaviour.
            const linkProps = site
              ? {
                  role: "link" as const,
                  tabIndex: 0,
                  "aria-label": `Visit ${client.name} website (opens in a new tab)`,
                  onClick: (e: MouseEvent<HTMLDivElement>) => {
                    if ((e.target as HTMLElement).closest("a, button")) return;
                    openSite(site);
                  },
                  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openSite(site);
                    }
                  },
                }
              : {};

            return (
              <div
                key={client.slug}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${clients.length}`}
                className="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[46%] lg:basis-[32%]"
              >
                <div
                  {...linkProps}
                  className={
                    site
                      ? "h-full cursor-pointer rounded-3xl transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30"
                      : "h-full"
                  }
                >
                  <ClientCard client={client} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Carousel position" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-teal-deep" style={{ width: `${Math.max(progress * 100, 14)}%` }} />
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous clients" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} className={btn}>
            <IconArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <button type="button" aria-label="Next clients" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} className={btn}>
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}