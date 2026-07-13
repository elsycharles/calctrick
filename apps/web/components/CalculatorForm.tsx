import type { ChangeEvent, FormEvent } from "react";

import {
  DISPLAY_OPERATORS,
  type CalculatorDraft,
  type DisplayOperator,
} from "@/lib/calculator";

interface CalculatorFormProps {
  readonly value: CalculatorDraft;
  readonly onChange: (value: CalculatorDraft) => void;
  readonly onSubmit: () => void;
}

export function CalculatorForm({ value, onChange, onSubmit }: CalculatorFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function updateNumber(field: "a" | "b", event: ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, [field]: event.target.value });
  }

  return (
    <form
      className="rounded-2xl border border-zinc-300 bg-white p-4 sm:p-5"
      onSubmit={handleSubmit}
      aria-label="Mental math calculator"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_4.25rem_minmax(0,1fr)] gap-2.5 md:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)_9rem] md:gap-3">
        <label className="min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
            First number
          </span>
          <input
            className="h-16 w-full min-w-0 rounded-xl border border-zinc-300 bg-canvas px-3 text-center font-mono text-xl font-bold text-ink transition-colors hover:border-zinc-400 focus:border-accent focus:bg-white focus:outline-none sm:text-2xl"
            type="number"
            inputMode="decimal"
            step="any"
            required
            value={value.a}
            onChange={(event) => updateNumber("a", event)}
          />
        </label>

        <label>
          <span className="mb-2 block text-center text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
            Op.
          </span>
          <select
            className="h-16 w-full rounded-xl border border-zinc-300 bg-canvas px-2 text-center font-mono text-xl font-bold text-ink transition-colors hover:border-zinc-400 focus:border-accent focus:bg-white focus:outline-none sm:text-2xl"
            value={value.op}
            onChange={(event) =>
              onChange({ ...value, op: event.target.value as DisplayOperator })
            }
            aria-label="Operator"
          >
            {DISPLAY_OPERATORS.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
            Second number
          </span>
          <input
            className="h-16 w-full min-w-0 rounded-xl border border-zinc-300 bg-canvas px-3 text-center font-mono text-xl font-bold text-ink transition-colors hover:border-zinc-400 focus:border-accent focus:bg-white focus:outline-none sm:text-2xl"
            type="number"
            inputMode="decimal"
            step="any"
            required
            value={value.b}
            onChange={(event) => updateNumber("b", event)}
          />
        </label>

        <button
          className="col-span-3 mt-1 h-14 rounded-xl bg-accent px-5 text-base font-bold text-white transition-opacity hover:opacity-90 active:opacity-80 md:col-span-1 md:mt-6 md:h-16"
          type="submit"
        >
          Solve
        </button>
      </div>
    </form>
  );
}
