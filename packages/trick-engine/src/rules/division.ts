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
    makeStep(absoluteLeft, "/", absoluteRight, "Divise d’abord les valeurs absolues."),
  ];
  if (isNegative) {
    steps.push(makeStep(0, "-", unsignedQuotient, "Applique le signe négatif au quotient."));
  }

  return [{
    rule: "division.sign",
    title: "Séparer le signe du calcul",
    summary: "Détermine le signe, puis divise uniquement les valeurs absolues.",
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
      title: `Simplifier par ${factor}`,
      summary: `Divise le numérateur et le dénominateur par ${factor}.`,
      expression: `${formatNumber(reducedNumerator)} ÷ ${formatNumber(reducedDenominator)}`,
      steps: [
        makeStep(calculation.left, "/", factor, "Réduis le numérateur."),
        makeStep(calculation.right, "/", factor, "Réduis le dénominateur."),
        makeStep(
          reducedNumerator,
          "/",
          reducedDenominator,
          "Calcule la division simplifiée.",
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
      title: `Multiplier les deux termes par ${factor}`,
      summary: `Change l’échelle des deux termes pour obtenir un diviseur plus simple.`,
      expression: `${formatNumber(scaledNumerator)} ÷ ${formatNumber(scaledDenominator)}`,
      steps: [
        makeStep(calculation.left, "*", factor, "Change l’échelle du numérateur."),
        makeStep(calculation.right, "*", factor, "Change le dénominateur avec le même facteur."),
        makeStep(
          scaledNumerator,
          "/",
          scaledDenominator,
          "Effectue la division avec le nouveau dénominateur.",
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
        title: `Diviser successivement par ${factor} et ${formatNumber(secondFactor)}`,
        summary: `Décompose ${formatNumber(calculation.right)} en ${factor} × ${formatNumber(secondFactor)}.`,
        expression: `${formatNumber(intermediate)} ÷ ${formatNumber(secondFactor)}`,
        steps: [
          makeStep(calculation.left, "/", factor, "Divise par le premier facteur."),
          makeStep(intermediate, "/", secondFactor, "Divise par le second facteur."),
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
      title: `Extraire un quotient de ${chunk}`,
      summary: `Décompose le numérateur en ${formatNumber(mainNumerator)} et ${formatNumber(remainderNumerator)}.`,
      expression: `${chunk} + ${formatNumber(remainderQuotient)}`,
      steps: [
        makeStep(mainNumerator, "/", calculation.right, "Divise la première partie."),
        makeStep(
          remainderNumerator,
          "/",
          calculation.right,
          "Divise le numérateur restant.",
        ),
        makeStep(chunk, "+", remainderQuotient, "Additionne les deux quotients."),
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
