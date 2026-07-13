import type { ChangeEvent, FormEvent } from "react";

import {
  DISPLAY_OPERATORS,
  type CalculatorDraft,
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
      className="overflow-hidden rounded-3xl bg-[#1B1B1F] p-4 text-white sm:p-5 md:p-6"
      onSubmit={handleSubmit}
      aria-label="Mental math calculator"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#A4A4AC]">
            New calculation
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] sm:text-xl">
            What do you want to simplify?
          </h2>
        </div>
        <span className="hidden rounded-full border border-white/10 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#B7B7BF] min-[420px]:inline-flex">
          Local engine
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.05] p-3 transition-colors focus-within:border-accent sm:p-3.5">
          <span className="block text-[0.6rem] font-bold uppercase tracking-[0.13em] text-[#A4A4AC]">
            Number A
          </span>
          <input
            className="mt-1.5 h-10 w-full min-w-0 bg-transparent font-mono text-2xl font-bold tracking-[-0.04em] text-white caret-accent outline-none placeholder:text-[#686870] sm:h-12 sm:text-3xl"
            aria-label="First number"
            type="number"
            inputMode="decimal"
            step="any"
            required
            value={value.a}
            onChange={(event) => updateNumber("a", event)}
          />
        </label>

        <label className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.05] p-3 transition-colors focus-within:border-accent sm:p-3.5">
          <span className="block text-[0.6rem] font-bold uppercase tracking-[0.13em] text-[#A4A4AC]">
            Number B
          </span>
          <input
            className="mt-1.5 h-10 w-full min-w-0 bg-transparent font-mono text-2xl font-bold tracking-[-0.04em] text-white caret-accent outline-none placeholder:text-[#686870] sm:h-12 sm:text-3xl"
            aria-label="Second number"
            type="number"
            inputMode="decimal"
            step="any"
            required
            value={value.b}
            onChange={(event) => updateNumber("b", event)}
          />
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-[#A4A4AC]">
          Choose an operation
        </legend>
        <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-black/20 p-1.5 sm:gap-2">
          {DISPLAY_OPERATORS.map((operator) => (
            <button
              key={operator}
              className={`grid h-11 place-items-center rounded-xl font-mono text-xl font-bold transition-[background-color,color,transform] active:scale-[0.97] sm:h-12 sm:text-2xl ${
                value.op === operator
                  ? "bg-accent text-white"
                  : "text-[#B7B7BF] hover:bg-white/[0.07] hover:text-white"
              }`}
              type="button"
              aria-label={`Select ${operatorName(operator)}`}
              aria-pressed={value.op === operator}
              onClick={() => onChange({ ...value, op: operator })}
            >
              {operator}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.7rem] leading-5 text-[#A4A4AC]">
          Ranked strategies. No data leaves your device.
        </p>
        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition-[opacity,transform] hover:opacity-90 active:scale-[0.98] sm:w-auto sm:min-w-40"
          type="submit"
          aria-label="Solve"
        >
          Find easier routes
        </button>
      </div>
    </form>
  );
}

function operatorName(operator: CalculatorDraft["op"]): string {
  switch (operator) {
    case "×":
      return "multiplication";
    case "÷":
      return "division";
    case "+":
      return "addition";
    case "−":
      return "subtraction";
  }
}
