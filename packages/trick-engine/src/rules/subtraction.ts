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
    title: "Turn two minus signs into a plus",
    summary: "Subtracting a negative number is the same as adding its positive value.",
    expression: `${formatNumber(calculation.left)} + ${formatNumber(Math.abs(calculation.right))}`,
    steps: [
      makeStep(
        calculation.left,
        "+",
        Math.abs(calculation.right),
        "Replace subtraction of a negative number with addition.",
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
      title: `Compensate to ${formatNumber(target)}`,
      summary: `Shift both terms by ${formatNumber(correction)} to round the subtrahend.`,
      expression: `${formatNumber(shiftedLeft)} − ${formatNumber(target)}`,
      steps: [
        makeAdjustment(calculation.left, correction, "Shift the first term."),
        makeAdjustment(calculation.right, correction, "Shift the second term by the same amount."),
        makeStep(shiftedLeft, "-", target, "Now subtract the round number."),
      ],
      tags: ["compensation", "round-number"],
      strategyPenalty: 0.4,
    });

    candidates.push({
      rule: "subtraction.round-and-correct",
      title: `Subtract ${formatNumber(target)}, then adjust`,
      summary: `Subtract the round number ${formatNumber(target)}, then adjust by ${formatNumber(correction)}.`,
      expression: formatAdjustment(directIntermediate, correction),
      steps: [
        makeStep(
          calculation.left,
          "-",
          target,
          "Subtract the nearest round number first.",
        ),
        makeAdjustment(directIntermediate, correction, "Restore the rounding difference."),
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
      title: `Bridge through ${formatNumber(anchor)}`,
      summary: `Find the two gaps around ${formatNumber(anchor)}, then add them.`,
      expression: `${formatNumber(upperGap)} + ${formatNumber(lowerGap)}`,
      steps: [
        makeStep(calculation.left, "-", anchor, "Calculate the gap above the anchor."),
        makeStep(anchor, "-", calculation.right, "Calculate the gap below the anchor."),
        makeStep(upperGap, "+", lowerGap, "Add the two gaps."),
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
    title: `Decompose ${formatNumber(subtrahend)}`,
    summary: `Split ${formatNumber(subtrahend)} into ${formatNumber(highPart)} and ${formatNumber(remainder)}.`,
    expression: `${formatNumber(intermediate)} − ${formatNumber(remainder)}`,
    steps: [
      makeStep(
        calculation.left,
        "-",
        highPart,
        "Subtract the highest-place part first.",
      ),
      makeStep(intermediate, "-", remainder, "Then subtract the remainder."),
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
