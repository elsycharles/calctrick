import { formatNumber, normalizeNumber } from "../math.js";
import type { ArithmeticOperator, Calculation } from "../types.js";
import type { CandidateStep } from "./types.js";

export function makeCalculation(
  left: number,
  operator: ArithmeticOperator,
  right: number,
): Calculation {
  return {
    left: normalizeNumber(left),
    operator,
    right: normalizeNumber(right),
  };
}

export function makeStep(
  left: number,
  operator: ArithmeticOperator,
  right: number,
  explanation: string,
): CandidateStep {
  return {
    calculation: makeCalculation(left, operator, right),
    explanation,
  };
}

export function makeAdjustment(
  value: number,
  delta: number,
  explanation: string,
): CandidateStep {
  return delta >= 0
    ? makeStep(value, "+", delta, explanation)
    : makeStep(value, "-", Math.abs(delta), explanation);
}

export function formatAdjustment(value: number, delta: number): string {
  const operator = delta >= 0 ? "+" : "−";
  return `${formatNumber(value)} ${operator} ${formatNumber(Math.abs(delta))}`;
}

export function uniqueNumbers(values: readonly number[]): readonly number[] {
  return [...new Set(values.map(normalizeNumber))];
}
