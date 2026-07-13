import {
  TrickEngineError,
  type ArithmeticOperator,
  type Calculation,
} from "./types.js";

const SIGNIFICANT_DIGITS = 15;

export function normalizeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new TrickEngineError(
      "NON_FINITE_RESULT",
      "The calculation produced a non-finite result.",
    );
  }

  if (value === 0) {
    return 0;
  }

  return Number(value.toPrecision(SIGNIFICANT_DIGITS));
}

export function calculate(calculation: Calculation): number {
  const { left, operator, right } = calculation;

  if (operator === "/" && right === 0) {
    throw new TrickEngineError("DIVISION_BY_ZERO", "Division by zero is undefined.");
  }

  switch (operator) {
    case "+":
      return normalizeNumber(left + right);
    case "-":
      return normalizeNumber(left - right);
    case "*":
      return normalizeNumber(left * right);
    case "/":
      return normalizeNumber(left / right);
  }
}

export function symbolFor(operator: ArithmeticOperator): string {
  if (operator === "*") {
    return "×";
  }

  if (operator === "/") {
    return "÷";
  }

  return operator;
}

export function formatNumber(value: number): string {
  const normalized = normalizeNumber(value);
  if (Number.isInteger(normalized)) {
    return normalized.toString();
  }

  return normalized.toString().replace("e+", "e");
}

export function formatCalculation(calculation: Calculation): string {
  return `${formatNumber(calculation.left)} ${symbolFor(calculation.operator)} ${formatNumber(calculation.right)}`;
}

export function nearlyEqual(left: number, right: number): boolean {
  const scale = Math.max(1, Math.abs(left), Math.abs(right));
  return Math.abs(left - right) <= Number.EPSILON * 16 * scale;
}

export function decimalPlaces(value: number): number {
  const [mantissa = "", rawExponent = "0"] = Math.abs(value).toString().split("e");
  const decimalCount = mantissa.split(".")[1]?.length ?? 0;
  const exponent = Number(rawExponent);
  return Math.max(0, decimalCount - exponent);
}

export function isPowerOfTen(value: number): boolean {
  if (value <= 0) {
    return false;
  }

  const exponent = Math.log10(value);
  return nearlyEqual(exponent, Math.round(exponent));
}

export function smallDivisors(value: number, maximum = 100): readonly number[] {
  const absoluteValue = Math.abs(value);
  if (!Number.isSafeInteger(absoluteValue) || absoluteValue < 2) {
    return [];
  }

  const divisors: number[] = [];
  for (let divisor = 2; divisor <= Math.min(maximum, absoluteValue); divisor += 1) {
    if (absoluteValue % divisor === 0) {
      divisors.push(divisor);
    }
  }
  return divisors;
}

export function nearbyMultiples(
  value: number,
  bases: readonly number[] = [1, 10, 100, 1_000],
): readonly number[] {
  const targets = new Set<number>();

  for (const base of bases) {
    const quotient = value / base;
    targets.add(normalizeNumber(Math.floor(quotient) * base));
    targets.add(normalizeNumber(Math.ceil(quotient) * base));
    targets.add(normalizeNumber(Math.round(quotient) * base));
  }

  targets.delete(value);
  return [...targets].filter(Number.isFinite);
}
