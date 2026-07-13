import {
  calculate,
  formatNumber,
  nearbyMultiples,
  normalizeNumber,
} from "../math.js";
import type { Calculation } from "../types.js";
import {
  formatAdjustment,
  makeAdjustment,
  makeStep,
} from "./shared.js";
import type { TrickCandidate, TrickRule } from "./types.js";

function compensationCandidates(calculation: Calculation): readonly TrickCandidate[] {
  const pairs = [
    { value: calculation.left, other: calculation.right, position: "premier" },
    { value: calculation.right, other: calculation.left, position: "second" },
  ] as const;
  const candidates: TrickCandidate[] = [];

  for (const { value, other, position } of pairs) {
    const maximumDelta = Math.max(1, Math.min(10, Math.abs(value) * 0.25));
    const targets = nearbyMultiples(value).filter(
      (target) => target !== 0 && Math.abs(target - value) <= maximumDelta,
    );

    for (const target of targets) {
      const delta = normalizeNumber(target - value);
      const adjustedOther = normalizeNumber(other - delta);
      candidates.push({
        rule: "addition.compensation",
        title: `Compenser vers ${formatNumber(target)}`,
        summary: `Ajuste le ${position} terme de ${formatNumber(delta)}, puis compense sur l’autre terme.`,
        expression: `${formatNumber(target)} + ${formatNumber(adjustedOther)}`,
        steps: [
          makeAdjustment(value, delta, "Arrondis ce terme."),
          makeAdjustment(other, -delta, "Compense avec le même écart."),
          makeStep(target, "+", adjustedOther, "Additionne les deux nombres plus simples."),
        ],
        tags: ["compensation", "round-number"],
        strategyPenalty: 0.5,
      });
    }
  }

  return candidates;
}

function nearDoubleCandidates(calculation: Calculation): readonly TrickCandidate[] {
  const candidates: TrickCandidate[] = [];
  const pairs = [
    { anchor: calculation.left, other: calculation.right },
    { anchor: calculation.right, other: calculation.left },
  ] as const;

  for (const { anchor, other } of pairs) {
    const difference = normalizeNumber(other - anchor);
    const maximumDifference = Math.max(
      1,
      Math.min(10, Math.max(Math.abs(anchor), Math.abs(other)) * 0.2),
    );

    if (
      difference === 0 ||
      Math.abs(difference) > maximumDifference ||
      Math.sign(anchor) !== Math.sign(other)
    ) {
      continue;
    }

    const doubled = calculate({ left: anchor, operator: "*", right: 2 });
    candidates.push({
      rule: "addition.near-double",
      title: `Utiliser le double de ${formatNumber(anchor)}`,
      summary: `Double ${formatNumber(anchor)}, puis corrige de ${formatNumber(difference)}.`,
      expression: formatAdjustment(doubled, difference),
      steps: [
        makeStep(anchor, "*", 2, "Calcule le double le plus proche."),
        makeAdjustment(doubled, difference, "Ajoute l’écart entre les deux termes."),
      ],
      tags: ["near-double"],
      strategyPenalty: 0.75,
    });
  }

  return candidates;
}

function placeValueCandidates(calculation: Calculation): readonly TrickCandidate[] {
  const candidates: TrickCandidate[] = [];
  const pairs = [
    { base: calculation.left, split: calculation.right },
    { base: calculation.right, split: calculation.left },
  ] as const;

  for (const { base, split } of pairs) {
    if (!Number.isSafeInteger(split) || Math.abs(split) < 10) {
      continue;
    }

    const magnitude = 10 ** Math.floor(Math.log10(Math.abs(split)));
    const highPart = Math.trunc(split / magnitude) * magnitude;
    const remainder = normalizeNumber(split - highPart);
    if (remainder === 0) {
      continue;
    }

    const intermediate = normalizeNumber(base + highPart);
    candidates.push({
      rule: "addition.place-value",
      title: `Décomposer ${formatNumber(split)}`,
      summary: `Sépare ${formatNumber(split)} en ${formatNumber(highPart)} et ${formatNumber(remainder)}.`,
      expression: `${formatAdjustment(base, highPart)}, puis ${formatAdjustment(intermediate, remainder)}`,
      steps: [
        makeAdjustment(base, highPart, "Ajoute d’abord la partie de plus grande valeur."),
        makeAdjustment(intermediate, remainder, "Ajoute ensuite le reste."),
      ],
      tags: ["decomposition", "place-value"],
      strategyPenalty: 0.5,
    });
  }

  return candidates;
}

export const additionRule: TrickRule = {
  id: "addition",
  operation: "+",
  generate(calculation) {
    return [
      ...compensationCandidates(calculation),
      ...nearDoubleCandidates(calculation),
      ...placeValueCandidates(calculation),
    ];
  },
};
