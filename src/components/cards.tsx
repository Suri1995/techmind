
"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/data";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full outline-none"
    >
      <article
        className="
          relative h-full overflow-hidden
          rounded-[24px]
          border border-slate-200/70
          bg-white
          shadow-[0_4px_20px_rgba(15,61,46,0.045)]
          transition-all duration-500 ease-out
          hover:-translate-y-2
          hover:border-teal-200
          hover:shadow-[0_20px_50px_rgba(15,61,46,0.12)]
          focus-visible:ring-2
          focus-visible:ring-teal-600
        "
      >
        {/* Image Section */}
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-soft">

          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="
              object-cover
              transition-transform duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-110
            "
          />

          {/* Cinematic Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-[#082D25]/65
              via-transparent
              to-black/10
              opacity-70
              transition-opacity duration-500
              group-hover:opacity-100
            "
          />

          {/* Category */}
          <div className="absolute bottom-4 left-4">
            <span
              className="
                inline-flex items-center
                rounded-full
                border border-white/30
                bg-white/90
                px-4 py-2
                text-[11px] font-semibold
                uppercase tracking-[0.12em]
                text-[#0F6B57]
                shadow-lg
                backdrop-blur-md
              "
            >
              {post.category}
            </span>
          </div>

          {/* Reading Time */}
          <div className="absolute right-4 top-4">
            <span
              className="
                flex items-center gap-1.5
                rounded-full
                border border-white/20
                bg-black/35
                px-3 py-2
                text-[11px] font-medium
                text-white
                backdrop-blur-md
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-5 sm:p-6">

          {/* Date */}
          <div className="mb-4 flex items-center gap-2 text-[12px] font-medium tracking-wide text-slate-500">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 11h18" />
            </svg>

            <span>{post.date}</span>

            <span className="mx-1 h-1 w-1 rounded-full bg-teal-600/60" />

            <span className="text-teal-700">
              Insights & Updates
            </span>
          </div>

          {/* Title */}
          <h3
            className="
              min-h-[3.5rem]
              font-display
              text-xl font-semibold
              leading-[1.4]
              tracking-[-0.025em]
              text-[#123D35]
              transition-colors duration-300
              group-hover:text-teal-700
              sm:text-[22px]
              line-clamp-2
            "
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className="
              mt-3
              line-clamp-3
              text-[14px]
              leading-[1.8]
              text-slate-500
            "
          >
            {post.excerpt}
          </p>

          {/* Bottom Action */}
          <div
            className="
              mt-6 flex items-center justify-between
              border-t border-slate-100
              pt-4
            "
          >
            <span
              className="
                text-[13px] font-semibold
                tracking-wide
                text-[#0F6B57]
                transition-colors
                group-hover:text-[#0F3D2E]
              "
            >
              Explore Article
            </span>

            <span
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full
                border border-teal-100
                bg-teal-50
                text-teal-700
                transition-all duration-300
                group-hover:translate-x-1
                group-hover:bg-[#0F3D2E]
                group-hover:text-white
                group-hover:border-[#0F3D2E]
              "
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>

        </div>
      </article>
    </Link>
  );
}
