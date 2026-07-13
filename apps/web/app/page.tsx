import { CalculatorApp } from "@/components/CalculatorApp";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-6">
      <div className="mx-auto w-full max-w-5xl">
        <nav className="mb-12 flex items-center justify-between gap-4 sm:mb-16" aria-label="Primary">
          <div className="flex items-center gap-3">
            <div
              className="grid size-11 place-items-center rounded-2xl border border-zinc-300 bg-white font-mono text-sm font-black tracking-[-0.12em] text-accent"
              aria-hidden="true"
            >
              C→
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-ink">CalcTrick</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Mental math, simplified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-600">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="hidden min-[390px]:inline">Works offline</span>
            <span className="min-[390px]:hidden">Offline</span>
          </div>
        </nav>

        <header className="mb-9 grid items-end gap-7 md:mb-12 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-12">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Mental math, reworked
            </p>
            <h1 className="max-w-3xl text-balance text-[2.7rem] font-bold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl md:text-7xl">
              Make the numbers work for you.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Turn one difficult calculation into a set of smaller, clearer moves —
              ranked by mental effort.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-zinc-300 bg-white p-5" aria-hidden="true">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-zinc-400">
              The CalcTrick way
            </p>
            <div className="mt-4 flex items-center gap-3 font-mono text-lg font-bold">
              <span className="text-zinc-400 line-through decoration-2">24 × 25</span>
              <span className="grid size-8 place-items-center rounded-full bg-accent text-sm text-white">→</span>
              <span className="text-ink">6 × 100</span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-zinc-200 pt-4">
              <span className="text-xs font-semibold text-zinc-500">Same answer</span>
              <span className="font-mono text-3xl font-bold tracking-tight text-accent">600</span>
            </div>
          </div>
        </header>

        <CalculatorApp />

        <footer className="mt-14 flex flex-col gap-2 border-t border-zinc-300 py-6 text-xs leading-5 text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>CalcTrick P0</span>
          <span>Your calculations stay on this device. Nothing is sent to a server.</span>
        </footer>
      </div>
    </main>
  );
}
