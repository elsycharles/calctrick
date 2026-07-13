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
    <section className="mt-8" aria-labelledby="results-heading" aria-live="polite">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Results</p>
          <h2 id="results-heading" className="mt-1 text-2xl font-bold tracking-tight text-ink">
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
        <div className="space-y-4">
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
        <div className="rounded-2xl border border-zinc-300 bg-white p-6">
          <p className="text-sm font-bold text-zinc-600">This one is already simple.</p>
          <p className="mt-3 font-mono text-lg text-zinc-500 line-through">
            {analysis.expression}
          </p>
          <p className="mt-2 font-mono text-5xl font-bold text-ink">{analysis.answer}</p>
        </div>
      )}
    </section>
  );
}
