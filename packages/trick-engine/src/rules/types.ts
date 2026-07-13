import type { ArithmeticOperator, Calculation } from "../types.js";

export interface CandidateStep {
  readonly calculation: Calculation;
  readonly explanation: string;
}

export interface TrickCandidate {
  readonly rule: string;
  readonly title: string;
  readonly summary: string;
  readonly expression: string;
  readonly steps: readonly CandidateStep[];
  readonly tags: readonly string[];
  readonly strategyPenalty: number;
}

export interface TrickRule {
  readonly id: string;
  readonly operation: ArithmeticOperator;
  generate(calculation: Calculation): readonly TrickCandidate[];
}
