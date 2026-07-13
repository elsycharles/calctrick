import {
  formatNumber,
  nearbyMultiples,
  normalizeNumber,
} from "../math.js";
import type { Calculation } from "../types.js";
import { formatAdjustment, makeAdjustment, makeStep, uniqueNumbers } from "./shared.js";
import type { TrickCandidate, TrickRule } from "./types.js";

function subtractNegativeCandidate(calculation: Calculation): readonly TrickCandidate[] {
  if (calculation.right >= 0) {
    return [];
  }

  return [{
    rule: "subtraction.negative",
    title: "Transformer les deux signes moins",
    summary: "Soustraire un nombre négatif revient à additionner sa valeur positive.",
    expression: `${formatNumber(calculation.left)} + ${formatNumber(Math.abs(calculation.right))}`,
    steps: [
      makeStep(
        calculation.left,
        "+",
        Math.abs(calculation.right),
        "Remplace la soustraction du négatif par une addition.",
      ),
    ],
    tags: ["negative-number", "sign"],
    strategyPenalty: 0,
  }];
}

function roundedSubtrahendCandidates(
  calculation: Calculation,
): readonly TrickCandidate[] {
  if (calculation.right <= 0) {
    return [];
  }

  const maximumDelta = Math.max(1, Math.min(10, Math.abs(calculation.right) * 0.25));
  const targets = nearbyMultiples(calculation.right).filter(
    (target) => target > 0 && Math.abs(target - calculation.right) <= maximumDelta,
  );
  const candidates: TrickCandidate[] = [];

  for (const target of targets) {
    const correction = normalizeNumber(target - calculation.right);
    const shiftedLeft = normalizeNumber(calculation.left + correction);
    const directIntermediate = normalizeNumber(calculation.left - target);

    candidates.push({
      rule: "subtraction.compensation",
      title: `Compenser vers ${formatNumber(target)}`,
      summary: `Ajoute ${formatNumber(correction)} aux deux termes pour arrondir le nombre soustrait.`,
      expression: `${formatNumber(shiftedLeft)} − ${formatNumber(target)}`,
      steps: [
        makeAdjustment(calculation.left, correction, "Décale le premier terme."),
        makeAdjustment(calculation.right, correction, "Décale le second du même montant."),
        makeStep(shiftedLeft, "-", target, "Soustrais maintenant le nombre rond."),
      ],
      tags: ["compensation", "round-number"],
      strategyPenalty: 0.4,
    });

    candidates.push({
      rule: "subtraction.round-and-correct",
      title: `Soustraire ${formatNumber(target)}, puis corriger`,
      summary: `Soustrais le nombre rond ${formatNumber(target)}, puis corrige de ${formatNumber(correction)}.`,
      expression: formatAdjustment(directIntermediate, correction),
      steps: [
        makeStep(
          calculation.left,
          "-",
          target,
          "Soustrais d’abord le nombre rond le plus proche.",
        ),
        makeAdjustment(directIntermediate, correction, "Réinjecte l’écart d’arrondi."),
      ],
      tags: ["round-and-correct", "round-number"],
      strategyPenalty: 0.5,
    });
  }

  return candidates;
}

function bridgeCandidates(calculation: Calculation): readonly TrickCandidate[] {
  if (calculation.left <= calculation.right || calculation.right < 0) {
    return [];
  }

  const anchors = uniqueNumbers([
    ...nearbyMultiples(calculation.left),
    ...nearbyMultiples(calculation.right),
  ]).filter(
    (anchor) => anchor > calculation.right && anchor < calculation.left && anchor >= 0,
  );

  return anchors.map((anchor): TrickCandidate => {
    const upperGap = normalizeNumber(calculation.left - anchor);
    const lowerGap = normalizeNumber(anchor - calculation.right);
    return {
      rule: "subtraction.bridge",
      title: `Passer par ${formatNumber(anchor)}`,
      summary: `Mesure les deux écarts autour de ${formatNumber(anchor)}, puis additionne-les.`,
      expression: `${formatNumber(upperGap)} + ${formatNumber(lowerGap)}`,
      steps: [
        makeStep(calculation.left, "-", anchor, "Calcule l’écart au-dessus du repère."),
        makeStep(anchor, "-", calculation.right, "Calcule l’écart au-dessous du repère."),
        makeStep(upperGap, "+", lowerGap, "Additionne les deux écarts."),
      ],
      tags: ["bridge", "count-up"],
      strategyPenalty: 0.75,
    };
  });
}

function placeValueCandidate(calculation: Calculation): readonly TrickCandidate[] {
  const subtrahend = calculation.right;
  if (!Number.isSafeInteger(subtrahend) || subtrahend < 10) {
    return [];
  }

  const magnitude = 10 ** Math.floor(Math.log10(subtrahend));
  const highPart = Math.trunc(subtrahend / magnitude) * magnitude;
  const remainder = normalizeNumber(subtrahend - highPart);
  if (remainder === 0) {
    return [];
  }

  const intermediate = normalizeNumber(calculation.left - highPart);
  return [{
    rule: "subtraction.place-value",
    title: `Décomposer ${formatNumber(subtrahend)}`,
    summary: `Sépare ${formatNumber(subtrahend)} en ${formatNumber(highPart)} et ${formatNumber(remainder)}.`,
    expression: `${formatNumber(intermediate)} − ${formatNumber(remainder)}`,
    steps: [
      makeStep(
        calculation.left,
        "-",
        highPart,
        "Soustrais d’abord la partie de plus grande valeur.",
      ),
      makeStep(intermediate, "-", remainder, "Soustrais ensuite le reste."),
    ],
    tags: ["decomposition", "place-value"],
    strategyPenalty: 0.5,
  }];
}

export const subtractionRule: TrickRule = {
  id: "subtraction",
  operation: "-",
  generate(calculation) {
    return [
      ...subtractNegativeCandidate(calculation),
      ...roundedSubtrahendCandidates(calculation),
      ...bridgeCandidates(calculation),
      ...placeValueCandidate(calculation),
    ];
  },
};
