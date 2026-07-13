import {
  TrickEngineError,
  type ArithmeticOperator,
  type Calculation,
  type CalculationSource,
} from "./types.js";

const NUMBER_PATTERN = "[+-]?(?:\\d+(?:[.,]\\d*)?|[.,]\\d+)";
const EXPRESSION_PATTERN = new RegExp(
  `^\\s*(${NUMBER_PATTERN})\\s*([+*\\/xX×÷:\\-])\\s*(${NUMBER_PATTERN})\\s*$`,
);

export function normalizeOperator(operator: string): ArithmeticOperator {
  switch (operator) {
    case "+":
    case "-":
      return operator;
    case "*":
    case "x":
    case "X":
    case "×":
      return "*";
    case "/":
    case "÷":
    case ":":
      return "/";
    default:
      throw new TrickEngineError(
        "UNSUPPORTED_OPERATOR",
        `Unsupported operator: ${operator}`,
      );
  }
}

function parseOperand(rawOperand: string): number {
  const operand = Number(rawOperand.replace(",", "."));
  validateOperand(operand);
  return Object.is(operand, -0) ? 0 : operand;
}

function validateOperand(operand: number): void {
  if (typeof operand !== "number" || !Number.isFinite(operand)) {
    throw new TrickEngineError(
      "INVALID_OPERAND",
      "Operands must be finite numbers.",
    );
  }
}

function parseExpression(source: string): Calculation {
  const normalizedSource = source.replace(/[−–—]/g, "-");
  const match = EXPRESSION_PATTERN.exec(normalizedSource);

  if (match === null) {
    throw new TrickEngineError(
      "INVALID_EXPRESSION",
      `Expected one binary calculation, received: ${source}`,
    );
  }

  const [, rawLeft, rawOperator, rawRight] = match;
  if (rawLeft === undefined || rawOperator === undefined || rawRight === undefined) {
    throw new TrickEngineError("INVALID_EXPRESSION", "Incomplete calculation.");
  }

  return {
    left: parseOperand(rawLeft),
    operator: normalizeOperator(rawOperator),
    right: parseOperand(rawRight),
  };
}

export function parseCalculation(source: CalculationSource): Calculation {
  if (typeof source === "string") {
    return parseExpression(source);
  }

  if (source === null || typeof source !== "object") {
    throw new TrickEngineError(
      "INVALID_EXPRESSION",
      "A calculation must be a string or an object.",
    );
  }

  validateOperand(source.left);
  validateOperand(source.right);

  return {
    left: Object.is(source.left, -0) ? 0 : source.left,
    operator: normalizeOperator(source.operator),
    right: Object.is(source.right, -0) ? 0 : source.right,
  };
}
