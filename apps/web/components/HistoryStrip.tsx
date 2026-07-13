import type { CalculatorValues } from "@/lib/calculator";
import type { HistoryEntry } from "@/lib/history";

interface HistoryStripProps {
  readonly entries: readonly HistoryEntry[];
  readonly onSelect: (values: CalculatorValues) => void;
}

export function HistoryStrip({ entries, onSelect }: HistoryStripProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-zinc-300 pt-6" aria-labelledby="history-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="history-heading" className="text-base font-bold tracking-tight text-ink">
          Recent calculations
        </h2>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
          Tap to reuse
        </span>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {entries.map((entry) => (
          <button
            key={`${entry.id ?? "pending"}-${entry.timestamp}`}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 font-mono text-sm font-bold text-zinc-700 transition-colors hover:border-accent hover:text-accent active:bg-accent/[0.06]"
            type="button"
            onClick={() => onSelect({ a: entry.a, op: entry.op, b: entry.b })}
            aria-label={`Load ${entry.a} ${entry.op} ${entry.b}`}
          >
            <span className="text-accent" aria-hidden="true">
              ↺
            </span>
            {entry.a} {entry.op} {entry.b}
          </button>
        ))}
      </div>
    </section>
  );
}
