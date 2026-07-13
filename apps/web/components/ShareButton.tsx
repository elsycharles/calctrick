"use client";

import { useEffect, useRef, useState } from "react";

interface ShareButtonProps {
  readonly expression: string;
}

export function ShareButton({ expression }: ShareButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "sharing" | "shared" | "copied" | "manual"
  >("idle");
  const [shareUrl, setShareUrl] = useState("");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  function showTemporaryStatus(nextStatus: "shared" | "copied") {
    setStatus(nextStatus);

    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
    }

    resetTimer.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimer.current = null;
    }, 2000);
  }

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: `${expression} made easier with CalcTrick`,
      text: `See simpler mental-math routes for ${expression}.`,
      url,
    };

    setShareUrl(url);
    setStatus("sharing");

    if (typeof navigator.share === "function") {
      try {
        if (typeof navigator.canShare === "function" && !navigator.canShare(shareData)) {
          throw new Error("This browser cannot share this content.");
        }

        await navigator.share(shareData);
        showTemporaryStatus("shared");
        return;
      } catch (error) {
        if (isShareCancellation(error)) {
          setStatus("idle");
          return;
        }
      }
    }

    if (await copyText(url)) {
      showTemporaryStatus("copied");
      return;
    }

    setStatus("manual");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void handleShare()}
        disabled={status === "sharing"}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 text-[0.7rem] font-bold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-ink disabled:cursor-wait disabled:opacity-60"
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
        {buttonLabel(status)}
      </button>

      <span className="sr-only" role="status" aria-live="polite">
        {status === "shared" ? "Calculation shared." : null}
        {status === "copied" ? "Calculation link copied." : null}
      </span>

      {status === "manual" ? (
        <div
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-2xl border border-zinc-300 bg-white p-4 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-12 sm:w-80"
          role="dialog"
          aria-label="Copy calculation link"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-ink">Copy this link</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Your browser blocked automatic sharing. Select and copy the URL below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lg text-zinc-500 hover:bg-zinc-100 hover:text-ink"
              aria-label="Close copy dialog"
            >
              ×
            </button>
          </div>

          <input
            className="mt-3 h-11 w-full rounded-xl border border-zinc-300 bg-canvas px-3 font-mono text-xs text-ink outline-none focus:border-accent"
            aria-label="Calculation link"
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      ) : null}
    </div>
  );
}

function buttonLabel(status: "idle" | "sharing" | "shared" | "copied" | "manual") {
  switch (status) {
    case "sharing":
      return "Opening…";
    case "shared":
      return "Shared";
    case "copied":
      return "Link copied";
    case "manual":
      return "Copy link";
    default:
      return "Share";
  }
}

function isShareCancellation(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator.clipboard?.writeText === "function") {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Some browsers expose Clipboard API but block it. Use the legacy fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
