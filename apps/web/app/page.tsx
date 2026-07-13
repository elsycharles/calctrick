import { CalculatorApp } from "@/components/CalculatorApp";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 sm:pt-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 sm:mb-10">
          <div className="mb-10 flex items-center gap-3 sm:mb-14">
            <div
              className="grid size-10 place-items-center rounded-xl bg-accent font-mono text-xl font-bold text-white"
              aria-hidden="true"
            >
              ÷
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-ink">CalcTrick</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Mental math, simplified
              </p>
            </div>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Find the easier route
          </p>
          <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
            Hard calculation. Simple next step.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
            Enter two numbers and CalcTrick will surface the clearest mental-math
            strategies, ranked from easiest to hardest.
          </p>
        </header>

        <CalculatorApp />

        <footer className="mt-10 border-t border-zinc-200 py-6 text-center text-xs leading-5 text-zinc-500">
          Your calculations stay on this device. Nothing is sent to a server.
        </footer>
      </div>
    </main>
  );
}
