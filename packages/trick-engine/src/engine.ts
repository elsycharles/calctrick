import {
  scoreCalculation,
  scoreCalculations,
  toDifficulty,
} from "./difficulty.js";
import {
  calculate,
  formatCalculation,
  formatNumber,
  nearlyEqual,
} from "./math.js";
import { parseCalculation } from "./parser.js";
import { additionRule } from "./rules/addition.js";
import { divisionRule } from "./rules/division.js";
import { multiplicationRule } from "./rules/multiplication.js";
import { subtractionRule } from "./rules/subtraction.js";
import type { TrickCandidate, TrickRule } from "./rules/types.js";
import {
  TrickEngineError,
  type CalculationSource,
  type GenerateTricksOptions,
  type Trick,
  type TrickAnalysis,
  type TrickStep,
} from "./types.js";

const DEFAULT_MAX_TRICKS = 8;
const DEFAULT_MINIMUM_IMPROVEMENT = 1;
const RULES: readonly TrickRule[] = [
  additionRule,
  subtractionRule,
  multiplicationRule,
  divisionRule,
];

interface ResolvedOptions {
  readonly maxTricks: number;
  readonly includeNonImproving: boolean;
  readonly minimumImprovement: number;
}

function resolveOptions(options: GenerateTricksOptions): ResolvedOptions {
  const maxTricks = options.maxTricks ?? DEFAULT_MAX_TRICKS;
  const minimumImprovement =
    options.minimumImprovement ?? DEFAULT_MINIMUM_IMPROVEMENT;

  if (!Number.isInteger(maxTricks) || maxTricks < 0 || maxTricks > 100) {
    throw new TrickEngineError(
      "INVALID_OPTIONS",
      "maxTricks must be an integer between 0 and 100.",
    );
  }
  if (!Number.isFinite(minimumImprovement) || minimumImprovement < 0) {
    throw new TrickEngineError(
      "INVALID_OPTIONS",
      "minimumImprovement must be a finite positive or zero number.",
    );
  }

  return {
    maxTricks,
    includeNonImproving: options.includeNonImproving ?? false,
    minimumImprovement,
  };
}

function safelyGenerate(rule: TrickRule, calculation: TrickAnalysis["calculation"]): readonly TrickCandidate[] {
  try {
    return rule.generate(calculation);
  } catch (error) {
    if (
      error instanceof TrickEngineError &&
      error.code === "NON_FINITE_RESULT"
    ) {
      return [];
    }
    throw error;
  }
}

function materializeCandidate(
  candidate: TrickCandidate,
  answer: number,
  originalScore: number,
): Omit<Trick, "id"> | null {
  const steps: TrickStep[] = candidate.steps.map(({ calculation, explanation }) => ({
    expression: formatCalculation(calculation),
    result: calculate(calculation),
    explanation,
  }));
  const lastResult = steps.at(-1)?.result;
  if (lastResult === undefined || !nearlyEqual(lastResult, answer)) {
    return null;
  }

  const difficulty = toDifficulty(
    scoreCalculations(
      candidate.steps.map((step) => step.calculation),
      candidate.strategyPenalty,
    ),
  );
  const improvement = Math.round((originalScore - difficulty.score) * 10) / 10;

  return {
    rule: candidate.rule,
    title: candidate.title,
    summary: candidate.summary,
    expression: candidate.expression,
    answer,
    difficulty,
    improvement,
    steps,
    tags: candidate.tags,
  };
}

function deduplicate(tricks: readonly Omit<Trick, "id">[]): readonly Omit<Trick, "id">[] {
  const bestByExpression = new Map<string, Omit<Trick, "id">>();

  for (const trick of tricks) {
    const existing = bestByExpression.get(trick.expression);
    if (existing === undefined || trick.difficulty.score < existing.difficulty.score) {
      bestByExpression.set(trick.expression, trick);
    }
  }

  return [...bestByExpression.values()];
}

export function generateTricks(
  source: CalculationSource,
  options: GenerateTricksOptions = {},
): TrickAnalysis {
  const resolvedOptions = resolveOptions(options);
  const calculation = parseCalculation(source);
  const answer = calculate(calculation);
  const directDifficulty = toDifficulty(scoreCalculation(calculation));
  const rule = RULES.find((candidateRule) => candidateRule.operation === calculation.operator);
  const candidates = rule === undefined ? [] : safelyGenerate(rule, calculation);
  const materialized = candidates
    .map((candidate) => materializeCandidate(candidate, answer, directDifficulty.score))
    .filter((trick): trick is Omit<Trick, "id"> => trick !== null);
  const filtered = deduplicate(materialized)
    .filter(
      (trick) =>
        resolvedOptions.includeNonImproving ||
        trick.improvement >= resolvedOptions.minimumImprovement,
    )
    .sort(
      (left, right) =>
        left.difficulty.score - right.difficulty.score ||
        right.improvement - left.improvement ||
        left.rule.localeCompare(right.rule) ||
        left.expression.localeCompare(right.expression),
    )
    .slice(0, resolvedOptions.maxTricks)
    .map((trick, index): Trick => ({
      id: `${trick.rule}:${index + 1}`,
      ...trick,
    }));

  return {
    calculation,
    expression: formatCalculation(calculation),
    answer,
    difficulty: directDifficulty,
    tricks: filtered,
    metadata: {
      generatedCandidates: candidates.length,
      returnedTricks: filtered.length,
    },
  };
}

export function solve(source: CalculationSource): number {
  return calculate(parseCalculation(source));
}

export type ExplanationMode = "compact" | "detailed";

export function explainTrick(
  trick: Trick,
  mode: ExplanationMode = "detailed",
): string {
  const compact = `${trick.expression} = ${formatNumber(trick.answer)}`;
  if (mode === "compact") {
    return compact;
  }

  const details = trick.steps.map(
    (step, index) =>
      `${index + 1}. ${step.expression} = ${formatNumber(step.result)} — ${step.explanation}`,
  );
  return [trick.title, trick.summary, compact, ...details].join("\n");
}
