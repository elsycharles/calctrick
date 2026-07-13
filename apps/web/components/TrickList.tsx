import type { TrickAnalysis } from "trick-engine";

import { ModeToggle, type DisplayMode } from "./ModeToggle";
import { TrickCard } from "./TrickCard";

interface TrickListProps {
  readonly analysis: TrickAnalysis;
  readonly mode: DisplayMode;
  readonly onModeChange: (mode: DisplayMode) => void;
}

export function TrickList({ analysis, mode, onModeChange }: TrickListProps) {
  return (
    <section className="mt-8 sm:mt-9" aria-labelledby="results-heading" aria-live="polite">
      <div className="mb-4 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:items-end min-[390px]:justify-between">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent">Your routes</p>
          <h2 id="results-heading" className="mt-1 text-2xl font-bold tracking-[-0.035em] text-ink sm:text-3xl">
            {analysis.tricks.length === 1
              ? "1 easier route"
              : `${analysis.tricks.length} easier routes`}
          </h2>
        </div>
        {analysis.tricks.length > 0 ? (
          <ModeToggle mode={mode} onChange={onModeChange} />
        ) : null}
      </div>

      {analysis.tricks.length > 0 ? (
        <div className="space-y-3.5">
          {analysis.tricks.map((trick, index) => (
            <TrickCard
              key={trick.id}
              trick={trick}
              originalExpression={analysis.expression}
              rank={index + 1}
              detailed={mode === "detailed"}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-300 bg-white p-5 sm:p-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent">Direct route</p>
          <p className="mt-2 text-lg font-bold text-ink">This one is already simple.</p>
          <div className="mt-4 flex items-end justify-between gap-5 border-t border-zinc-200 pt-4">
            <p className="font-mono text-base text-zinc-500">{analysis.expression}</p>
            <p className="font-mono text-4xl font-bold tracking-[-0.05em] text-ink">
              {analysis.answer}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
