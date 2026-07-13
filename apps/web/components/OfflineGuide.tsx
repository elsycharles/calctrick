"use client";

import { useEffect, useRef, useState } from "react";

const INSTALL_OPTIONS = [
  {
    platform: "iPhone or iPad",
    path: "Safari · Share · Add to Home Screen · Add",
  },
  {
    platform: "Android",
    path: "Chrome · Browser menu · Install app",
  },
  {
    platform: "Computer",
    path: "Chrome or Edge · Browser menu · Install CalcTrick",
  },
] as const;

export function OfflineGuide() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 text-[0.7rem] font-semibold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-ink"
        type="button"
        aria-label="Works offline"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        <span className="hidden min-[370px]:inline">Works offline</span>
        <span className="min-[370px]:hidden">Offline</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid items-end bg-ink/45 p-0 backdrop-blur-[2px] sm:place-items-center sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        >
          <section
            className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[1.5rem] bg-canvas p-5 sm:max-w-xl sm:rounded-[1.5rem] sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-guide-title"
            aria-describedby="offline-guide-description"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent">
                  Offline access
                </p>
                <h2
                  id="offline-guide-title"
                  className="mt-1.5 text-xl font-bold tracking-[-0.025em] text-ink"
                >
                  Keep CalcTrick ready anywhere
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-300 bg-white text-lg text-zinc-600 hover:text-ink"
                type="button"
                aria-label="Close offline guide"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <p
              id="offline-guide-description"
              className="mt-3 max-w-lg text-sm leading-6 text-zinc-600"
            >
              The calculator and its trick engine are saved on your device after your
              first online visit. Your history also stays local.
            </p>

            <ol className="mt-5 grid gap-2.5 sm:grid-cols-3">
              {[
                ["01", "Load once", "Open this page while you are connected."],
                ["02", "Install", "Use your browser’s install option below."],
                ["03", "Go offline", "Open CalcTrick from its new app icon."],
              ].map(([number, title, detail]) => (
                <li key={number} className="rounded-xl border border-zinc-300 bg-white p-3.5">
                  <span className="font-mono text-[0.65rem] font-bold text-accent">{number}</span>
                  <p className="mt-2 text-sm font-bold text-ink">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>
                </li>
              ))}
            </ol>

            <div className="mt-5 divide-y divide-zinc-200 rounded-xl border border-zinc-300 bg-white px-4">
              {INSTALL_OPTIONS.map((option) => (
                <div key={option.platform} className="py-3.5 first:pt-4 last:pb-4">
                  <p className="text-xs font-bold text-ink">{option.platform}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{option.path}</p>
                </div>
              ))}
            </div>

            <button
              className="mt-5 h-11 w-full rounded-xl bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              type="button"
              onClick={() => setOpen(false)}
            >
              Got it
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
