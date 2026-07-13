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
    <section className="mt-10 sm:mt-12" aria-labelledby="results-heading" aria-live="polite">
      <div className="mb-5 flex flex-col gap-4 min-[390px]:flex-row min-[390px]:items-end min-[390px]:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Your routes</p>
          <h2 id="results-heading" className="mt-1.5 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">
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
        <div className="space-y-5">
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
        <div className="rounded-[1.75rem] border border-zinc-300 bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Direct route</p>
          <p className="mt-3 text-xl font-bold text-ink">This one is already simple.</p>
          <div className="mt-6 flex items-end justify-between gap-5 border-t border-zinc-200 pt-5">
            <p className="font-mono text-lg text-zinc-500">{analysis.expression}</p>
            <p className="font-mono text-5xl font-bold tracking-[-0.05em] text-ink">
              {analysis.answer}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
