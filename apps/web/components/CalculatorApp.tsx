"use client";

import { useEffect, useState } from "react";
import type { TrickAnalysis } from "trick-engine";

import {
  type CalculatorDraft,
  type CalculatorValues,
  runCalculation,
} from "@/lib/calculator";
import {
  getRecentCalculations,
  type HistoryEntry,
  saveCalculation,
} from "@/lib/history";

import { CalculatorForm } from "./CalculatorForm";
import { HistoryStrip } from "./HistoryStrip";
import type { DisplayMode } from "./ModeToggle";
import { TrickList } from "./TrickList";

const INITIAL_DRAFT: CalculatorDraft = {
  a: "24",
  op: "×",
  b: "25",
};

export function CalculatorApp() {
  const [draft, setDraft] = useState<CalculatorDraft>(INITIAL_DRAFT);
  const [analysis, setAnalysis] = useState<TrickAnalysis | null>(null);
  const [mode, setMode] = useState<DisplayMode>("quick");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshHistory();
  }, []);

  async function refreshHistory() {
    try {
      setHistory(await getRecentCalculations());
    } catch {
      setHistory([]);
    }
  }

  function parseDraft(): CalculatorValues | null {
    const a = Number(draft.a);
    const b = Number(draft.b);

    if (draft.a.trim() === "" || draft.b.trim() === "" || !Number.isFinite(a) || !Number.isFinite(b)) {
      setError("Enter two valid numbers.");
      return null;
    }
    if (draft.op === "÷" && b === 0) {
      setError("Division by zero is not defined.");
      return null;
    }

    return { a, op: draft.op, b };
  }

  function handleSolve() {
    const values = parseDraft();
    if (values === null) {
      return;
    }

    try {
      setAnalysis(runCalculation(values));
      setError(null);
      void saveCalculation(values)
        .then(refreshHistory)
        .catch(() => undefined);
    } catch (caughtError) {
      setAnalysis(null);
      setError(caughtError instanceof Error ? caughtError.message : "Unable to solve this calculation.");
    }
  }

  function handleHistorySelect(values: CalculatorValues) {
    setDraft({
      a: String(values.a),
      op: values.op,
      b: String(values.b),
    });
    setAnalysis(null);
    setError(null);
  }

  return (
    <div>
      <CalculatorForm value={draft} onChange={setDraft} onSubmit={handleSolve} />

      {error !== null ? (
        <p
          className="mt-3 rounded-xl border border-accent bg-white px-4 py-3 text-sm font-semibold text-ink"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {analysis !== null ? (
        <TrickList analysis={analysis} mode={mode} onModeChange={setMode} />
      ) : (
        <section className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white/45 px-4 py-6 text-center sm:py-7">
          <div className="mx-auto grid max-w-sm grid-cols-2 gap-3 text-left font-mono text-sm font-bold">
            <div className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5">
              <span className="block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Original
              </span>
              <span className="mt-1 block text-zinc-400 line-through">24 × 25</span>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5">
              <span className="block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">
                Simpler
              </span>
              <span className="mt-1 block text-ink">6 × 100</span>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-zinc-500">
            Your ranked routes will appear here.
          </p>
        </section>
      )}

      <HistoryStrip entries={history} onSelect={handleHistorySelect} />
    </div>
  );
}
