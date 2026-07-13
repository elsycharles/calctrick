import { describe, expect, it } from "vitest";

import {
  explainTrick,
  generateTricks,
  solve,
  TrickEngineError,
} from "../src/index.js";

describe("engine safeguards", () => {
  it("removes common floating-point noise", () => {
    expect(solve("0.1 + 0.2")).toBe(0.3);
  });

  it("rejects division by zero with a typed error", () => {
    expectErrorCode(() => generateTricks("10 / 0"), "DIVISION_BY_ZERO");
  });

  it("rejects a non-finite answer", () => {
    expectErrorCode(
      () => generateTricks({ left: Number.MAX_VALUE, operator: "*", right: 2 }),
      "NON_FINITE_RESULT",
    );
  });

  it.each([
    { maxTricks: -1 },
    { maxTricks: 1.5 },
    { maxTricks: 101 },
    { minimumImprovement: -1 },
    { minimumImprovement: Number.NaN },
  ])("rejects invalid options: $maxTricks $minimumImprovement", (options) => {
    expectErrorCode(
      () => generateTricks("24 * 25", options),
      "INVALID_OPTIONS",
    );
  });

  it("supports explicitly requesting no tricks", () => {
    const analysis = generateTricks("24 * 25", { maxTricks: 0 });

    expect(analysis.answer).toBe(600);
    expect(analysis.tricks).toEqual([]);
    expect(analysis.metadata.returnedTricks).toBe(0);
  });
});

describe("explanations", () => {
  it("renders a compact solution", () => {
    const trick = generateTricks("24 * 25").tricks[0];
    expect(trick).toBeDefined();

    expect(explainTrick(trick!, "compact")).toBe("6 × 100 = 600");
  });

  it("renders every calculation in detailed mode", () => {
    const trick = generateTricks("24 * 25").tricks[0];
    expect(trick).toBeDefined();

    const explanation = explainTrick(trick!);
    expect(explanation).toContain("Diviser par 4, multiplier par 4");
    expect(explanation).toContain("1. 24 ÷ 4 = 6");
    expect(explanation).toContain("2. 25 × 4 = 100");
    expect(explanation).toContain("3. 6 × 100 = 600");
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
