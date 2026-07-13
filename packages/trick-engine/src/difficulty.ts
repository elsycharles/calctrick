import { isPowerOfTen, isRoundNumber, normalizeNumber } from "./math.js";
import type { Calculation, Difficulty } from "./types.js";

function numberComplexity(value: number): number {
  const absoluteValue = Math.abs(value);
  if (absoluteValue === 0 || absoluteValue === 1 || isPowerOfTen(absoluteValue)) {
    return 0.5;
  }

  const text = absoluteValue.toString();
  const decimalPenalty = text.includes(".") ? 2 + (text.split(".")[1]?.length ?? 0) : 0;
  const integerPart = Math.trunc(absoluteValue).toString();
  const usefulTrailingZeros = integerPart.match(/0+$/)?.[0].length ?? 0;
  const digitCost = Math.min(10, integerPart.length * 1.4);
  const signPenalty = value < 0 ? 0.75 : 0;

  return Math.max(1, digitCost + decimalPenalty - usefulTrailingZeros + signPenalty);
}

function isSmallInteger(value: number): boolean {
  return Number.isInteger(value) && Math.abs(value) <= 10;
}

function scoreAddition(left: number, right: number): number {
  if (left === 0 || right === 0) {
    return 1;
  }

  if (left === right) {
    return 2.5 + numberComplexity(left) * 0.35;
  }

  if (isSmallInteger(left) || isSmallInteger(right)) {
    return 1.5 + Math.max(numberComplexity(left), numberComplexity(right)) * 0.35;
  }

  if (isRoundNumber(left) || isRoundNumber(right)) {
    return 1.5 + Math.max(numberComplexity(left), numberComplexity(right)) * 0.45;
  }

  return 5 + numberComplexity(left) + numberComplexity(right);
}

function scoreMultiplication(left: number, right: number): number {
  const absoluteLeft = Math.abs(left);
  const absoluteRight = Math.abs(right);

  if (left === 0 || right === 0 || absoluteLeft === 1 || absoluteRight === 1) {
    return 1;
  }

  if (isPowerOfTen(absoluteLeft) || isPowerOfTen(absoluteRight)) {
    return 1.2 + Math.max(numberComplexity(left), numberComplexity(right)) * 0.2;
  }

  if (isSmallInteger(left) || isSmallInteger(right)) {
    return 3.5 + Math.max(numberComplexity(left), numberComplexity(right)) * 0.55;
  }

  if (left === right) {
    return 6 + numberComplexity(left);
  }

  return 8 + numberComplexity(left) + numberComplexity(right);
}

function scoreDivision(left: number, right: number): number {
  const absoluteRight = Math.abs(right);
  const quotient = normalizeNumber(left / right);

  if (left === 0 || absoluteRight === 1) {
    return 1;
  }

  if (isPowerOfTen(absoluteRight)) {
    return 1.5 + numberComplexity(left) * 0.25;
  }

  if (
    Number.isInteger(quotient) &&
    Math.abs(quotient) <= 10 &&
    absoluteRight <= 12
  ) {
    return 3.5 + numberComplexity(right) * 0.4;
  }

  if (isSmallInteger(right)) {
    return 5 + numberComplexity(left) * 0.65;
  }

  return 9 + numberComplexity(left) + numberComplexity(right);
}

export function scoreCalculation(calculation: Calculation): number {
  const { left, operator, right } = calculation;

  switch (operator) {
    case "+":
      return scoreAddition(left, right);
    case "-":
      return scoreAddition(left, -right) + (left < right ? 0.5 : 0);
    case "*":
      return scoreMultiplication(left, right);
    case "/":
      return scoreDivision(left, right);
  }
}

export function scoreCalculations(
  calculations: readonly Calculation[],
  strategyPenalty = 0,
): number {
  const total = calculations.reduce(
    (score, calculation) => score + scoreCalculation(calculation),
    strategyPenalty,
  );
  return normalizeNumber(total);
}

export function toDifficulty(rawScore: number): Difficulty {
  const score = Math.max(1, Math.min(100, Math.round(rawScore * 10) / 10));

  if (score <= 5) {
    return { score, level: "very-easy" };
  }
  if (score <= 12) {
    return { score, level: "easy" };
  }
  if (score <= 24) {
    return { score, level: "medium" };
  }
  return { score, level: "hard" };
}
