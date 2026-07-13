import { describe, expect, it } from "vitest";

import { generateTricks, solve } from "../src/index.js";

describe("arithmetic rules", () => {
  it.each([
    ["12.5 + 7.5", 20],
    ["83 - 29", 54],
    ["24 x 25", 600],
    ["156 / 12", 13],
    ["5 - -4", 9],
  ] as const)("solves %s", (source, answer) => {
    expect(solve(source)).toBe(answer);
    expect(generateTricks(source).answer).toBe(answer);
  });

  it("transfers a factor to solve 24 × 25 as 6 × 100", () => {
    const analysis = generateTricks("24 x 25");

    expect(analysis.tricks[0]).toMatchObject({
      rule: "multiplication.factor-transfer",
      expression: "6 × 100",
      answer: 600,
    });
  });

  it("offers compensation and place-value addition", () => {
    const expressions = generateTricks("38 + 27").tricks.map(
      (trick) => trick.expression,
    );

    expect(expressions).toContain("40 + 25");
    expect(expressions).toContain("38 + 20, puis 58 + 7");
  });

  it("offers round-and-correct subtraction", () => {
    const analysis = generateTricks("83 - 29");

    expect(analysis.tricks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "subtraction.round-and-correct",
          expression: "53 + 1",
        }),
        expect.objectContaining({
          rule: "subtraction.compensation",
          expression: "84 − 30",
        }),
      ]),
    );
  });

  it("uses the difference of squares for nearby factors", () => {
    expect(generateTricks("48 * 52").tricks[0]).toMatchObject({
      rule: "multiplication.difference-of-squares",
      expression: "2500 − 4",
      answer: 2_496,
    });
  });

  it("scales a decimal divisor", () => {
    expect(generateTricks("7.5 / 0.25").tricks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "division.scale",
          expression: "30 ÷ 1",
          answer: 30,
        }),
      ]),
    );
  });

  it("decomposes a quotient into easier chunks", () => {
    expect(generateTricks("156 / 12").tricks[0]).toMatchObject({
      rule: "division.quotient-decomposition",
      expression: "10 + 3",
      answer: 13,
    });
  });

  it("turns subtraction of a negative into addition", () => {
    expect(generateTricks("5 - -4").tricks[0]).toMatchObject({
      rule: "subtraction.negative",
      expression: "5 + 4",
      answer: 9,
    });
  });

  it("separates signs from a negative division", () => {
    expect(generateTricks("20 / -5").tricks[0]).toMatchObject({
      rule: "division.sign",
      expression: "−20 ÷ 5",
      answer: -4,
    });
  });
});

describe("ranking", () => {
  it("sorts all returned tricks by ascending difficulty", () => {
    const scores = generateTricks("48 * 52").tricks.map(
      (trick) => trick.difficulty.score,
    );

    expect(scores).toEqual([...scores].sort((left, right) => left - right));
  });

  it("respects the result limit", () => {
    const analysis = generateTricks("24 * 25", { maxTricks: 2 });

    expect(analysis.tricks).toHaveLength(2);
    expect(analysis.metadata.returnedTricks).toBe(2);
    expect(analysis.metadata.generatedCandidates).toBeGreaterThan(2);
  });

  it("can include strategies that do not improve the score", () => {
    const defaultResult = generateTricks("24 * 25", { maxTricks: 100 });
    const exhaustiveResult = generateTricks("24 * 25", {
      includeNonImproving: true,
      maxTricks: 100,
    });

    expect(defaultResult.tricks.every((trick) => trick.improvement >= 1)).toBe(true);
    expect(exhaustiveResult.tricks.some((trick) => trick.improvement < 1)).toBe(true);
  });
});
