import { describe, expect, it } from "vitest";

import {
  parseCalculation,
  TrickEngineError,
  type CalculationInput,
} from "../src/index.js";

describe("parseCalculation", () => {
  it.each([
    ["24 x 25", "*"],
    ["24 X 25", "*"],
    ["24 × 25", "*"],
    ["24 * 25", "*"],
    ["24 ÷ 6", "/"],
    ["24 : 6", "/"],
    ["24 / 6", "/"],
    ["24 + 6", "+"],
    ["24 − 6", "-"],
  ] as const)("normalizes %s", (source, operator) => {
    expect(parseCalculation(source).operator).toBe(operator);
  });

  it("parses signed values and a decimal comma", () => {
    expect(parseCalculation("-12,5 - -2,5")).toEqual({
      left: -12.5,
      operator: "-",
      right: -2.5,
    });
  });

  it("normalizes a structured calculation", () => {
    expect(parseCalculation({ left: 8, operator: "÷", right: 4 })).toEqual({
      left: 8,
      operator: "/",
      right: 4,
    });
  });

  it("rejects expressions with more than one operation", () => {
    expect(() => parseCalculation("2 + 3 * 4")).toThrowError(TrickEngineError);
    expectErrorCode(() => parseCalculation("2 + 3 * 4"), "INVALID_EXPRESSION");
  });

  it("rejects unsupported operators", () => {
    const input = { left: 2, operator: "%", right: 1 } as unknown as CalculationInput;
    expectErrorCode(() => parseCalculation(input), "UNSUPPORTED_OPERATOR");
  });

  it("rejects non-finite operands", () => {
    expectErrorCode(
      () => parseCalculation({ left: Number.NaN, operator: "+", right: 1 }),
      "INVALID_OPERAND",
    );
  });
});

function expectErrorCode(
  callback: () => unknown,
  code: TrickEngineError["code"],
): void {
  try {
    callback();
    throw new Error("Expected callback to throw");
  } catch (error) {
    expect(error).toBeInstanceOf(TrickEngineError);
    expect((error as TrickEngineError).code).toBe(code);
  }
}
