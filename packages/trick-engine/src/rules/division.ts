import {
  decimalPlaces,
  formatNumber,
  isPowerOfTen,
  isRoundNumber,
  normalizeNumber,
  smallDivisors,
} from "../math.js";
import type { Calculation } from "../types.js";
import { makeStep } from "./shared.js";
import type { TrickCandidate, TrickRule } from "./types.js";

function signCandidate(calculation: Calculation): readonly TrickCandidate[] {
  if (
    calculation.left === 0 ||
    (calculation.left >= 0 && calculation.right > 0)
  ) {
    return [];
  }

  const absoluteLeft = Math.abs(calculation.left);
  const absoluteRight = Math.abs(calculation.right);
  const unsignedQuotient = normalizeNumber(absoluteLeft / absoluteRight);
  const isNegative = Math.sign(calculation.left) !== Math.sign(calculation.right);
  const steps = [
    makeStep(absoluteLeft, "/", absoluteRight, "Divide the absolute values first."),
  ];
  if (isNegative) {
    steps.push(makeStep(0, "-", unsignedQuotient, "Apply the negative sign to the quotient."));
  }

  return [{
    rule: "division.sign",
    title: "Handle the sign separately",
    summary: "Determine the sign, then divide only the absolute values.",
    expression: `${isNegative ? "−" : ""}${formatNumber(absoluteLeft)} ÷ ${formatNumber(absoluteRight)}`,
    steps,
    tags: ["negative-number", "sign"],
    strategyPenalty: 0.25,
  }];
}

function commonFactorCandidates(calculation: Calculation): readonly TrickCandidate[] {
  if (
    !Number.isSafeInteger(calculation.left) ||
    !Number.isSafeInteger(calculation.right) ||
    calculation.left <= 0 ||
    calculation.right <= 0
  ) {
    return [];
  }

  const commonDivisors = smallDivisors(calculation.left).filter(
    (factor) => calculation.right % factor === 0,
  );

  return commonDivisors.map((factor): TrickCandidate => {
    const reducedNumerator = normalizeNumber(calculation.left / factor);
    const reducedDenominator = normalizeNumber(calculation.right / factor);
    return {
      rule: "division.common-factor",
      title: `Simplify by ${factor}`,
      summary: `Divide the numerator and denominator by ${factor}.`,
      expression: `${formatNumber(reducedNumerator)} ÷ ${formatNumber(reducedDenominator)}`,
      steps: [
        makeStep(calculation.left, "/", factor, "Reduce the numerator."),
        makeStep(calculation.right, "/", factor, "Reduce the denominator."),
        makeStep(
          reducedNumerator,
          "/",
          reducedDenominator,
          "Calculate the simplified division.",
        ),
      ],
      tags: ["simplification", "common-factor"],
      strategyPenalty: 0.5,
    };
  });
}

function scaleCandidates(calculation: Calculation): readonly TrickCandidate[] {
  if (calculation.left <= 0 || calculation.right <= 0) {
    return [];
  }

  const scaleFactors = [2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 1_000];
  const denominatorDecimals = decimalPlaces(calculation.right);
  const candidates: TrickCandidate[] = [];

  for (const factor of scaleFactors) {
    const scaledNumerator = normalizeNumber(calculation.left * factor);
    const scaledDenominator = normalizeNumber(calculation.right * factor);
    const removesDecimals =
      denominatorDecimals > 0 && Number.isInteger(scaledDenominator);
    if (
      !removesDecimals &&
      !isPowerOfTen(scaledDenominator) &&
      !isRoundNumber(scaledDenominator)
    ) {
      continue;
    }

    candidates.push({
      rule: "division.scale",
      title: `Multiply both terms by ${factor}`,
      summary: `Scale both terms to obtain a simpler divisor.`,
      expression: `${formatNumber(scaledNumerator)} ÷ ${formatNumber(scaledDenominator)}`,
      steps: [
        makeStep(calculation.left, "*", factor, "Scale the numerator."),
        makeStep(calculation.right, "*", factor, "Scale the denominator by the same factor."),
        makeStep(
          scaledNumerator,
          "/",
          scaledDenominator,
          "Perform the division with the new denominator.",
        ),
      ],
      tags: ["scale", "round-number"],
      strategyPenalty: 0.75,
    });
  }

  return candidates;
}

function denominatorFactorCandidates(
  calculation: Calculation,
): readonly TrickCandidate[] {
  if (
    !Number.isSafeInteger(calculation.right) ||
    calculation.left <= 0 ||
    calculation.right <= 1
  ) {
    return [];
  }

  return smallDivisors(calculation.right)
    .filter((factor) => factor < calculation.right)
    .map((factor): TrickCandidate => {
      const secondFactor = calculation.right / factor;
      const intermediate = normalizeNumber(calculation.left / factor);
      return {
        rule: "division.denominator-factors",
        title: `Divide successively by ${factor} and ${formatNumber(secondFactor)}`,
        summary: `Factor ${formatNumber(calculation.right)} into ${factor} × ${formatNumber(secondFactor)}.`,
        expression: `${formatNumber(intermediate)} ÷ ${formatNumber(secondFactor)}`,
        steps: [
          makeStep(calculation.left, "/", factor, "Divide by the first factor."),
          makeStep(intermediate, "/", secondFactor, "Divide by the second factor."),
        ],
        tags: ["factorization", "sequential-division"],
        strategyPenalty: 0.5,
      };
    });
}

function quotientDecompositionCandidates(
  calculation: Calculation,
): readonly TrickCandidate[] {
  if (calculation.left <= 0 || calculation.right <= 0) {
    return [];
  }

  const quotient = calculation.left / calculation.right;
  const chunks = [1_000, 500, 100, 50, 20, 10, 5, 2, 1].filter(
    (chunk) => chunk < quotient,
  );
  const candidates: TrickCandidate[] = [];

  for (const chunk of chunks) {
    const mainNumerator = normalizeNumber(calculation.right * chunk);
    const remainderNumerator = normalizeNumber(calculation.left - mainNumerator);
    const remainderQuotient = normalizeNumber(remainderNumerator / calculation.right);
    if (remainderNumerator <= 0 || remainderQuotient === 0) {
      continue;
    }

    candidates.push({
      rule: "division.quotient-decomposition",
      title: `Extract a quotient of ${chunk}`,
      summary: `Split the numerator into ${formatNumber(mainNumerator)} and ${formatNumber(remainderNumerator)}.`,
      expression: `${chunk} + ${formatNumber(remainderQuotient)}`,
      steps: [
        makeStep(mainNumerator, "/", calculation.right, "Divide the first part."),
        makeStep(
          remainderNumerator,
          "/",
          calculation.right,
          "Divide the remaining numerator.",
        ),
        makeStep(chunk, "+", remainderQuotient, "Add the two quotients."),
      ],
      tags: ["decomposition", "partial-quotients"],
      strategyPenalty: 0.75,
    });
  }

  return candidates;
}

export const divisionRule: TrickRule = {
  id: "division",
  operation: "/",
  generate(calculation) {
    return [
      ...signCandidate(calculation),
      ...commonFactorCandidates(calculation),
      ...scaleCandidates(calculation),
      ...denominatorFactorCandidates(calculation),
      ...quotientDecompositionCandidates(calculation),
    ];
  },
};
