"use client";

import { useState } from "react";

interface ShareButtonProps {
  readonly expression: string;
}

export function ShareButton({ expression }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  async function handleShare() {
    const shareData = {
      title: `${expression} made easier with CalcTrick`,
      text: `See simpler mental-math routes for ${expression}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share !== undefined) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setStatus("idle");
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 text-[0.7rem] font-bold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-ink"
      aria-label="Share calculation"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      >
        <circle cx="5" cy="10" r="2" />
        <circle cx="15" cy="5" r="2" />
        <circle cx="15" cy="15" r="2" />
        <path d="m6.8 9.1 6.4-3.2M6.8 10.9l6.4 3.2" />
      </svg>
      {status === "copied" ? "Link copied" : "Share"}
    </button>
  );
}
