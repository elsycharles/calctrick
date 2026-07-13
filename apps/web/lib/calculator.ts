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

const URL_OPERATOR: Readonly<Record<DisplayOperator, string>> = {
  "×": "mul",
  "÷": "div",
  "+": "add",
  "−": "sub",
};

const DISPLAY_OPERATOR_FROM_URL: Readonly<Record<string, DisplayOperator>> = {
  mul: "×",
  div: "÷",
  add: "+",
  sub: "−",
};

const LEGACY_SHARE_TEXT = " See simpler mental-math routes for ";

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

export function createCalculatorSearch(values: CalculatorValues): string {
  const search = new URLSearchParams({
    a: String(values.a),
    op: URL_OPERATOR[values.op],
    b: String(values.b),
  });

  return `?${search.toString()}`;
}

export function parseCalculatorSearch(search: string): CalculatorValues | null {
  const params = new URLSearchParams(search);
  const rawA = params.get("a");
  const rawB = params.get("b");
  const rawOperator = params.get("op");

  if (
    rawA === null ||
    rawB === null ||
    rawOperator === null ||
    rawA.trim() === "" ||
    rawB.trim() === ""
  ) {
    return null;
  }

  const a = Number(rawA);
  const b = Number(stripLegacyShareText(rawB));
  const op = DISPLAY_OPERATOR_FROM_URL[rawOperator];

  if (!Number.isFinite(a) || !Number.isFinite(b) || op === undefined) {
    return null;
  }

  if (op === "÷" && b === 0) {
    return null;
  }

  return { a, op, b };
}

function stripLegacyShareText(value: string): string {
  const textStart = value.indexOf(LEGACY_SHARE_TEXT);
  return textStart === -1 ? value : value.slice(0, textStart);
}
