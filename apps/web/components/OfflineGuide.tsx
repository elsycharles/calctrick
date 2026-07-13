"use client";

import { useEffect, useRef, useState } from "react";

const INSTALL_OPTIONS = [
  {
    id: "ios",
    label: "iPhone",
    title: "On iPhone or iPad",
    steps: ["Open CalcTrick in Safari", "Tap Share", "Choose Add to Home Screen", "Tap Add"],
  },
  {
    id: "android",
    label: "Android",
    title: "On Android",
    steps: ["Open CalcTrick in Chrome", "Open the browser menu", "Choose Install app", "Confirm Install"],
  },
  {
    id: "desktop",
    label: "Computer",
    title: "On a computer",
    steps: ["Open CalcTrick in Chrome or Edge", "Open the browser menu", "Choose Install CalcTrick"],
  },
] as const;

type PlatformId = (typeof INSTALL_OPTIONS)[number]["id"];

export function OfflineGuide() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<PlatformId>("ios");
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

  const selectedOption =
    INSTALL_OPTIONS.find((option) => option.id === platform) ?? INSTALL_OPTIONS[0];

  function openGuide() {
    if (/android/i.test(navigator.userAgent)) {
      setPlatform("android");
    } else if (/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
      setPlatform("ios");
    } else {
      setPlatform("desktop");
    }
    setOpen(true);
  }

  return (
    <>
      <button
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 text-[0.7rem] font-semibold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-ink"
        type="button"
        aria-label="Works offline"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openGuide}
      >
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        <span className="hidden min-[370px]:inline">Works offline</span>
        <span className="min-[370px]:hidden">Offline</span>
      </button>

      {open ? (
        <div
          className="drawer-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-ink/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
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
            className="drawer-panel flex h-[92dvh] max-h-[42rem] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-canvas sm:h-[min(42rem,calc(100dvh-3rem))] sm:max-w-xl sm:rounded-[1.5rem]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-guide-title"
            aria-describedby="offline-guide-description"
          >
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-zinc-300 sm:hidden" aria-hidden="true" />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3 sm:px-6 sm:pt-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-accent">
                    Offline access
                  </p>
                  <h2
                    id="offline-guide-title"
                    className="mt-1 text-xl font-bold tracking-[-0.025em] text-ink"
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
                className="mt-2.5 max-w-md text-sm leading-5 text-zinc-600"
              >
                The main screen and trick engine are saved after your first online visit.
                Your history stays on this device too.
              </p>

              <ol className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-300 bg-white px-3.5 sm:grid sm:grid-cols-3 sm:gap-2 sm:divide-y-0 sm:border-0 sm:bg-transparent sm:px-0">
                {[
                  ["01", "Load once", "Visit CalcTrick while connected."],
                  ["02", "Install", "Follow the instructions for your device."],
                  ["03", "Use offline", "Launch it from the new app icon."],
                ].map(([number, title, detail]) => (
                  <li
                    key={number}
                    className="grid grid-cols-[1.75rem_1fr] gap-3 py-3 sm:block sm:rounded-xl sm:border sm:border-zinc-300 sm:bg-white sm:p-3"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-accent/[0.09] font-mono text-[0.6rem] font-bold text-accent">
                      {number}
                    </span>
                    <div className="sm:mt-2">
                      <p className="text-xs font-bold text-ink">{title}</p>
                      <p className="mt-0.5 text-xs leading-4 text-zinc-500">{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5">
                <p className="text-xs font-bold text-ink">Install on your device</p>
                <div
                  className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-zinc-300 bg-white p-1"
                  role="group"
                  aria-label="Installation platform"
                >
                  {INSTALL_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      className={`min-h-9 rounded-lg px-2 text-[0.68rem] font-bold transition-colors ${
                        option.id === platform
                          ? "bg-ink text-white"
                          : "text-zinc-500 hover:text-ink"
                      }`}
                      type="button"
                      aria-pressed={option.id === platform}
                      onClick={() => setPlatform(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 rounded-xl bg-accent/[0.07] p-3.5">
                  <p className="text-xs font-bold text-ink">{selectedOption.title}</p>
                  <ol className="mt-2 space-y-1.5">
                    {selectedOption.steps.map((step, index) => (
                      <li key={step} className="flex gap-2 text-xs leading-5 text-zinc-600">
                        <span className="font-mono text-[0.65rem] font-bold text-accent">
                          {index + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-zinc-200 bg-canvas px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-5">
              <button
                className="h-11 w-full rounded-xl bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                type="button"
                onClick={() => setOpen(false)}
              >
                Got it
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
