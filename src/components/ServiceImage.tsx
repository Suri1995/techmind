"use client";

import Image from "next/image";
import { useState } from "react";
import { getService, getServiceVisual } from "@/lib/data";

/**
 * Fills its parent (give the parent a size, e.g. `aspect-[2/1]`).
 * Reads the image + accent colour from `serviceVisuals` in lib/data.ts.
 * If the file is missing, a branded panel is shown instead of an empty box.
 */
export default function ServiceImage({
  slug,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  slug: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const visual = getServiceVisual(slug);
  const service = getService(slug);
  const ok = !!visual.image && !failed;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${visual.accent}, #071a1d)` }}
    >
      {ok ? (
        <Image
          src={visual.image}
          alt={visual.alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="font-display text-4xl text-white/80 sm:text-6xl">{service?.number}</span>
          <span className="text-sm font-semibold text-paper sm:text-lg">{service?.name}</span>
        </div>
      )}
    </div>
  );
}