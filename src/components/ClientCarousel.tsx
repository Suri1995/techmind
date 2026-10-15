"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Client } from "@/lib/data";
import ClientCard from "./ClientCard";
import { IconArrowRight } from "./icons";

/** Opens a client's website in a new tab. Used only when `client.website` is set. */
function openSite(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Draggable, snap-aligned carousel with a scrubbable progress rail. */
export default function ClientCarousel({ clients }: { clients: Client[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState<number[]>([0]);
  const railRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setInView(emblaApi.slidesInView());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial sync with the embla instance
    update();
    const down = () => setDragging(true);
    const up = () => setDragging(false);
    emblaApi
      .on("scroll", update)
      .on("reInit", update)
      .on("select", update)
      .on("slidesInView", update)
      .on("pointerDown", down)
      .on("pointerUp", up);
    return () => {
      emblaApi
        .off("scroll", update)
        .off("reInit", update)
        .off("select", update)
        .off("slidesInView", update)
        .off("pointerDown", down)
        .off("pointerUp", up);
    };
  }, [emblaApi, update]);

  /** Click or tap anywhere on the rail to jump to that position. */
  const scrubRail = (e: MouseEvent<HTMLDivElement>) => {
    if (!emblaApi || !railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    emblaApi.scrollTo(Math.round(ratio * (emblaApi.scrollSnapList().length - 1)));
  };

  // Thumb size reflects how much of the list is currently visible.
  const total = Math.max(clients.length, 1);
  const visibleCount = Math.max(inView.length, 1);
  const thumbWidth = Math.min(100, Math.max((visibleCount / total) * 100, 12));
  const thumbLeft = progress * (100 - thumbWidth);

  const first = inView.length ? Math.min(...inView) + 1 : 1;
  const last = inView.length ? Math.max(...inView) + 1 : 1;

  // Soft fade on whichever edge has more content, so the carousel feels continuous.
  const left = canPrev ? "transparent, #000 40px" : "#000, #000";
  const right = canNext ? "#000 calc(100% - 72px), transparent" : "#000, #000";
  const mask = `linear-gradient(to right, ${left}, ${right})`;

  const btn =
    "group flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft backdrop-blur transition-all duration-300 hover:border-teal-deep hover:bg-teal-deep hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 active:scale-95 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-white/70 disabled:hover:text-ink-soft disabled:active:scale-100";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client partnerships"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") emblaApi?.scrollNext();
        if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      }}
    >
      {/* Viewport */}
      <div
        ref={emblaRef}
        className={`-mx-2 overflow-hidden px-2 pt-6 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        <div className="flex gap-6 pb-8 pr-6">
          {clients.map((client, i) => {
            const site = client.website;
            const visible = inView.includes(i);

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
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${clients.length}`}
                className={`min-w-0 shrink-0 grow-0 basis-[88%] transition-opacity duration-500 motion-reduce:transition-none sm:basis-[46%] lg:basis-[32%] ${
                  visible ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  {...linkProps}
                  className={
                    site
                      ? `group/card relative h-full rounded-3xl transition-all duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 ${
                          dragging
                            ? ""
                            : "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(15,60,60,0.35)] motion-reduce:hover:translate-y-0"
                        }`
                      : "h-full"
                  }
                >
                  <ClientCard client={client} />

                  {site && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-deep text-white opacity-0 shadow-lg shadow-teal-deep/25 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100 translate-y-1 motion-reduce:transition-none"
                    >
                      <IconArrowRight className="h-4 w-4 -rotate-45" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-2 flex items-center gap-5 sm:gap-8">

        {/* Rail: tall hit area, slim visual track */}
        <div
          ref={railRef}
          onClick={scrubRail}
          className="group/rail relative flex h-8 flex-1 cursor-pointer items-center"
          role="progressbar"
          aria-label="Carousel position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className="relative h-[3px] w-full rounded-full bg-line transition-[height] duration-200 group-hover/rail:h-[5px]">
            <div
              className="absolute inset-y-0 rounded-full bg-teal-deep"
              style={{ left: `${thumbLeft}%`, width: `${thumbWidth}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Previous clients"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className={btn}
          >
            <IconArrowRight className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5 group-disabled:translate-x-0" />
          </button>
          <button
            type="button"
            aria-label="Next clients"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className={btn}
          >
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0" />
          </button>
        </div>
      </div>
    </div>
  );
}