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
    <section className="mt-8 border-t border-zinc-300 pt-5" aria-labelledby="history-heading">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 id="history-heading" className="text-sm font-bold tracking-tight text-ink">
          Recent calculations
        </h2>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-zinc-400">
          Tap to reuse
        </span>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {entries.map((entry) => (
          <button
            key={`${entry.id ?? "pending"}-${entry.timestamp}`}
            className="min-h-9 shrink-0 rounded-full border border-zinc-300 bg-white px-3.5 font-mono text-xs font-bold text-zinc-700 transition-colors hover:border-accent hover:text-accent active:bg-accent/[0.06]"
            type="button"
            onClick={() => onSelect({ a: entry.a, op: entry.op, b: entry.b })}
            aria-label={`Load ${entry.a} ${entry.op} ${entry.b}`}
          >
            {entry.a} {entry.op} {entry.b}
          </button>
        ))}
      </div>
    </section>
  );
}
