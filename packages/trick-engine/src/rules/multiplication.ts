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
    makeStep(absoluteLeft, "*", absoluteRight, "Multiply the absolute values first."),
  ];
  if (isNegative) {
    steps.push(makeStep(0, "-", unsignedProduct, "Apply the negative sign to the product."));
  }

  return [{
    rule: "multiplication.sign",
    title: "Handle the sign separately",
    summary: "Determine the sign, then multiply only the absolute values.",
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
        title: `Divide by ${factor}, multiply by ${factor}`,
        summary: `Transfer the factor ${factor} from one term to the other without changing the product.`,
        expression: `${formatNumber(reducedSource)} × ${formatNumber(expandedDestination)}`,
        steps: [
          makeStep(source, "/", factor, "Divide one factor."),
          makeStep(destination, "*", factor, "Multiply the other by the same value."),
          makeStep(
            reducedSource,
            "*",
            expandedDestination,
            friendlyDestination
              ? "The second factor is now round; finish the multiplication."
              : "Finish with the two new factors.",
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
        title: `Distribute around ${formatNumber(target)}`,
        summary: `Replace ${formatNumber(rounded)} with ${formatAdjustment(target, remainder)} and distribute the product.`,
        expression: formatAdjustment(mainProduct, correction),
        steps: [
          makeStep(multiplier, "*", target, "Multiply by the round part."),
          makeStep(
            multiplier,
            "*",
            Math.abs(remainder),
            "Calculate the small correction product.",
          ),
          makeAdjustment(mainProduct, correction, "Apply the correction to the main product."),
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
    title: `Use the square of ${formatNumber(middle)}`,
    summary: `The factors are equally distant from ${formatNumber(middle)}, so use a² − b².`,
    expression: `${formatNumber(middleSquare)} − ${formatNumber(distanceSquare)}`,
    steps: [
      makeStep(middle, "*", middle, "Calculate the square of the middle number."),
      makeStep(distance, "*", distance, "Calculate the square of the distance."),
      makeStep(middleSquare, "-", distanceSquare, "Subtract the two squares."),
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
