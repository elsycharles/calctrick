import { generateTricks, type ArithmeticOperator, type TrickAnalysis } from "trick-engine";

export const DISPLAY_OPERATORS = ["×", "÷", "+", "−"] as const;

export type DisplayOperator = (typeof DISPLAY_OPERATORS)[number];

export interface CalculatorValues {
  readonly a: number;
  readonly op: DisplayOperator;
  readonly b: number;
}

export interface CalculatorDraft {
  readonly a: string;
  readonly op: DisplayOperator;
  readonly b: string;
}

const ENGINE_OPERATOR: Readonly<Record<DisplayOperator, ArithmeticOperator>> = {
  "×": "*",
  "÷": "/",
  "+": "+",
  "−": "-",
};

export function runCalculation(values: CalculatorValues): TrickAnalysis {
  return generateTricks({
    left: values.a,
    operator: ENGINE_OPERATOR[values.op],
    right: values.b,
  });
}

export function formatHistoryExpression(values: CalculatorValues): string {
  return `${values.a} ${values.op} ${values.b}`;
}
