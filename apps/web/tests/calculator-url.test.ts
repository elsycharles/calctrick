import { describe, expect, it } from "vitest";

import { createCalculatorSearch, parseCalculatorSearch } from "@/lib/calculator";

describe("calculator URLs", () => {
  it("serializes and parses a shareable calculation", () => {
    const search = createCalculatorSearch({ a: 24, op: "×", b: 25 });

    expect(search).toBe("?a=24&op=mul&b=25");
    expect(parseCalculatorSearch(search)).toEqual({ a: 24, op: "×", b: 25 });
  });

  it("rejects incomplete, invalid, and zero-divisor URLs", () => {
    expect(parseCalculatorSearch("?a=24&b=25")).toBeNull();
    expect(parseCalculatorSearch("?a=nope&op=mul&b=25")).toBeNull();
    expect(parseCalculatorSearch("?a=24&op=div&b=0")).toBeNull();
  });

  it("repairs links polluted by the previous native share text", () => {
    const pollutedSearch =
      "?a=245&op=mul&b=25%20See%20simpler%20mental-math%20routes%20for%20245%20%C3%97%2025.";

    expect(parseCalculatorSearch(pollutedSearch)).toEqual({ a: 245, op: "×", b: 25 });
  });
});
