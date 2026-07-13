import { describe, expect, it } from "vitest";

import {
  generateTricks,
  type ArithmeticOperator,
  type CalculationInput,
} from "../src/index.js";

describe("generated strategy invariants", () => {
  const operands = [-50, -11, -2, 0, 0.25, 2, 4, 9, 12, 19, 24, 25, 48, 52, 99];
  const operators: readonly ArithmeticOperator[] = ["+", "-", "*", "/"];

  it("keeps every generated route equivalent to the source calculation", () => {
    for (const operator of operators) {
      for (const left of operands) {
        for (const right of operands) {
          if (operator === "/" && right === 0) {
            continue;
          }

          const input: CalculationInput = { left, operator, right };
          const analysis = generateTricks(input, {
            includeNonImproving: true,
            maxTricks: 100,
          });

          for (const trick of analysis.tricks) {
            expect(trick.answer).toBe(analysis.answer);
            expect(trick.steps.at(-1)?.result).toBeCloseTo(analysis.answer, 12);
          }
        }
      }
    }
  });

  it("returns unique expressions in stable difficulty order", () => {
    for (const source of ["38 + 27", "83 - 29", "48 * 52", "156 / 12"]) {
      const tricks = generateTricks(source, {
        includeNonImproving: true,
        maxTricks: 100,
      }).tricks;
      const expressions = tricks.map((trick) => trick.expression);
      const scores = tricks.map((trick) => trick.difficulty.score);

      expect(new Set(expressions).size).toBe(expressions.length);
      expect(scores).toEqual([...scores].sort((left, right) => left - right));
    }
  });
});
