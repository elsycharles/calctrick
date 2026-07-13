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
    <section className="mt-8" aria-labelledby="history-heading">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 id="history-heading" className="text-sm font-bold text-ink">
          Recent calculations
        </h2>
        <span className="text-xs text-zinc-500">On this device</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
          <button
            key={`${entry.id ?? "pending"}-${entry.timestamp}`}
            className="min-h-10 rounded-full border border-zinc-300 bg-white px-4 font-mono text-sm font-bold text-zinc-700 transition-colors hover:border-accent hover:text-accent"
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
