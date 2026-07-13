import { CalculatorApp } from "@/components/CalculatorApp";
import { BrandMark } from "@/components/BrandMark";
import { OfflineGuide } from "@/components/OfflineGuide";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/90 bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-6"
          aria-label="Primary"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark size={34} />
            <div>
              <p className="text-base font-bold tracking-[-0.02em] text-ink">CalcTrick</p>
              <p className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-zinc-500 min-[390px]:block">
                Mental math, simplified
              </p>
            </div>
          </div>
          <OfflineGuide />
        </nav>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6rem+env(safe-area-inset-top))]">

        <header className="mb-7 grid items-end gap-6 md:mb-9 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-9">
          <div>
            <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
              Mental math, reworked
            </p>
            <h1 className="max-w-2xl text-balance text-[2.35rem] font-bold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[3.25rem] md:text-[3.75rem]">
              Make the numbers work for you.
            </h1>
            <p className="mt-3.5 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Turn one difficult calculation into a set of smaller, clearer moves —
              ranked by mental effort.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-300 bg-white p-4" aria-hidden="true">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
              A simpler route
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4 font-mono">
              <div>
                <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">Original</p>
                <p className="mt-1.5 text-sm font-bold text-zinc-400 line-through decoration-2">24 × 25</p>
              </div>
              <div className="border-l border-zinc-200 pl-4">
                <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">Simpler</p>
                <p className="mt-1.5 text-sm font-bold text-ink">6 × 100</p>
              </div>
            </div>
            <div className="mt-3.5 flex items-end justify-between border-t border-zinc-200 pt-3.5">
              <span className="text-[0.7rem] font-semibold text-zinc-500">Same answer</span>
              <span className="font-mono text-2xl font-bold tracking-[-0.04em] text-accent">600</span>
            </div>
          </div>
        </header>

        <CalculatorApp />

        <footer className="mt-10 flex flex-col gap-1.5 border-t border-zinc-300 py-5 text-[0.7rem] leading-5 text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>CalcTrick</span>
          <span>Your calculations stay on this device. Nothing is sent to a server.</span>
        </footer>
      </div>
    </main>
  );
}
