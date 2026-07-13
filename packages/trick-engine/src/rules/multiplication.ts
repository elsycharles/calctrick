import {
  formatNumber,
  isPowerOfTen,
  isRoundNumber,
  nearbyMultiples,
  normalizeNumber,
  smallDivisors,
} from "../math.js";
import type { Calculation } from "../types.js";
import { formatAdjustment, makeAdjustment, makeStep } from "./shared.js";
import type { TrickCandidate, TrickRule } from "./types.js";

function signCandidate(calculation: Calculation): readonly TrickCandidate[] {
  if (calculation.left >= 0 && calculation.right >= 0) {
    return [];
  }

  const absoluteLeft = Math.abs(calculation.left);
  const absoluteRight = Math.abs(calculation.right);
  const unsignedProduct = normalizeNumber(absoluteLeft * absoluteRight);
  const isNegative = Math.sign(calculation.left) !== Math.sign(calculation.right);
  const steps = [
    makeStep(absoluteLeft, "*", absoluteRight, "Multiplie d’abord les valeurs absolues."),
  ];
  if (isNegative) {
    steps.push(makeStep(0, "-", unsignedProduct, "Applique le signe négatif au produit."));
  }

  return [{
    rule: "multiplication.sign",
    title: "Séparer le signe du calcul",
    summary: "Détermine le signe, puis multiplie uniquement les valeurs absolues.",
    expression: `${isNegative ? "−" : ""}${formatNumber(absoluteLeft)} × ${formatNumber(absoluteRight)}`,
    steps,
    tags: ["negative-number", "sign"],
    strategyPenalty: 0.25,
  }];
}

function factorTransferCandidates(calculation: Calculation): readonly TrickCandidate[] {
  if (calculation.left <= 0 || calculation.right <= 0) {
    return [];
  }

  const pairs = [
    { source: calculation.left, destination: calculation.right },
    { source: calculation.right, destination: calculation.left },
  ] as const;
  const candidates: TrickCandidate[] = [];

  for (const { source, destination } of pairs) {
    for (const factor of smallDivisors(source)) {
      const reducedSource = normalizeNumber(source / factor);
      const expandedDestination = normalizeNumber(destination * factor);
      const friendlyDestination =
        isPowerOfTen(expandedDestination) || isRoundNumber(expandedDestination);

      candidates.push({
        rule: "multiplication.factor-transfer",
        title: `Diviser par ${factor}, multiplier par ${factor}`,
        summary: `Transfère le facteur ${factor} d’un terme vers l’autre sans changer le produit.`,
        expression: `${formatNumber(reducedSource)} × ${formatNumber(expandedDestination)}`,
        steps: [
          makeStep(source, "/", factor, "Divise un facteur."),
          makeStep(destination, "*", factor, "Multiplie l’autre par la même valeur."),
          makeStep(
            reducedSource,
            "*",
            expandedDestination,
            friendlyDestination
              ? "Le second facteur est maintenant rond : termine le produit."
              : "Termine avec les deux nouveaux facteurs.",
          ),
        ],
        tags: friendlyDestination
          ? ["factor-transfer", "round-number"]
          : ["factor-transfer"],
        strategyPenalty: 0.75,
      });
    }
  }

  return candidates;
}

function distributiveCandidates(calculation: Calculation): readonly TrickCandidate[] {
  if (calculation.left <= 0 || calculation.right <= 0) {
    return [];
  }

  const pairs = [
    { multiplier: calculation.left, rounded: calculation.right },
    { multiplier: calculation.right, rounded: calculation.left },
  ] as const;
  const candidates: TrickCandidate[] = [];

  for (const { multiplier, rounded } of pairs) {
    const maximumDelta = Math.max(1, Math.min(10, rounded * 0.25));
    const targets = nearbyMultiples(rounded).filter(
      (target) => target > 0 && Math.abs(target - rounded) <= maximumDelta,
    );

    for (const target of targets) {
      const remainder = normalizeNumber(rounded - target);
      const mainProduct = normalizeNumber(multiplier * target);
      const correctionProduct = normalizeNumber(multiplier * Math.abs(remainder));
      const correction = remainder >= 0 ? correctionProduct : -correctionProduct;

      candidates.push({
        rule: "multiplication.distributive",
        title: `Distribuer autour de ${formatNumber(target)}`,
        summary: `Remplace ${formatNumber(rounded)} par ${formatAdjustment(target, remainder)} et distribue le produit.`,
        expression: formatAdjustment(mainProduct, correction),
        steps: [
          makeStep(multiplier, "*", target, "Multiplie par la partie ronde."),
          makeStep(
            multiplier,
            "*",
            Math.abs(remainder),
            "Calcule le petit produit de correction.",
          ),
          makeAdjustment(mainProduct, correction, "Applique la correction au produit principal."),
        ],
        tags: ["distributive", "round-number"],
        strategyPenalty: 0.75,
      });
    }
  }

  return candidates;
}

function differenceOfSquaresCandidate(
  calculation: Calculation,
): readonly TrickCandidate[] {
  if (
    !Number.isSafeInteger(calculation.left) ||
    !Number.isSafeInteger(calculation.right) ||
    calculation.left <= 0 ||
    calculation.right <= 0 ||
    calculation.left === calculation.right ||
    (calculation.left + calculation.right) % 2 !== 0
  ) {
    return [];
  }

  const middle = (calculation.left + calculation.right) / 2;
  const distance = Math.abs(calculation.left - calculation.right) / 2;
  if (distance > 10) {
    return [];
  }

  const middleSquare = normalizeNumber(middle * middle);
  const distanceSquare = normalizeNumber(distance * distance);
  return [{
    rule: "multiplication.difference-of-squares",
    title: `Utiliser le carré de ${formatNumber(middle)}`,
    summary: `Les facteurs sont à égale distance de ${formatNumber(middle)} : utilise a² − b².`,
    expression: `${formatNumber(middleSquare)} − ${formatNumber(distanceSquare)}`,
    steps: [
      makeStep(middle, "*", middle, "Calcule le carré du nombre central."),
      makeStep(distance, "*", distance, "Calcule le carré de l’écart."),
      makeStep(middleSquare, "-", distanceSquare, "Soustrais les deux carrés."),
    ],
    tags: ["difference-of-squares", "algebra"],
    strategyPenalty: 1,
  }];
}

export const multiplicationRule: TrickRule = {
  id: "multiplication",
  operation: "*",
  generate(calculation) {
    return [
      ...signCandidate(calculation),
      ...factorTransferCandidates(calculation),
      ...distributiveCandidates(calculation),
      ...differenceOfSquaresCandidate(calculation),
    ];
  },
};
