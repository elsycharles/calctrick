# trick-engine

CalcTrick's pure TypeScript engine. It solves one binary operation, generates several mathematically equivalent mental-math routes, estimates their difficulty, and ranks them from easiest to hardest.

The package is private, has no runtime dependencies, and does not depend on React or Next.js.

## Current scope

- Addition, subtraction, multiplication, and division.
- Integers, decimals, and signed numbers.
- Text or typed object input.
- Direct answer, compact solution, and step-by-step explanation.
- Deduplicated strategies sorted by estimated difficulty.
- Typed errors for invalid input and division by zero.

The P0 engine intentionally handles **one binary operation at a time**. An expression such as `2 + 3 * 4` is rejected instead of being interpreted ambiguously. The UI, training mode, and history are outside this package.

## Commands

From the monorepo root:

```bash
npm install
npm test
npm run typecheck
npm run build
```

Or for this workspace only:

```bash
npm test --workspace trick-engine
npm run typecheck --workspace trick-engine
npm run build --workspace trick-engine
```

## Usage

```ts
import { explainTrick, generateTricks, solve } from "trick-engine";

const analysis = generateTricks("24 x 25");

analysis.answer; // 600
analysis.tricks[0]?.expression; // "6 × 100"
analysis.tricks[0]?.difficulty; // { score: 11.3, level: "easy" }

const compact = explainTrick(analysis.tricks[0]!, "compact");
// 6 × 100 = 600

const detailed = explainTrick(analysis.tricks[0]!, "detailed");
// Divide by 4, multiply by 4
// ...
// 1. 24 ÷ 4 = 6 — Divide one factor.
// 2. 25 × 4 = 100 — Multiply the other by the same value.
// 3. 6 × 100 = 600 — ...

solve({ left: 7.5, operator: "÷", right: 0.25 }); // 30
```

The parser accepts `*`, `x`, `X`, `×`, `/`, `÷`, `:`, `+`, and `-`. Text input accepts either a decimal point or decimal comma, for example `"12,5 - 2,5"`.

## Inspecting the complete result in Node

Node's default object display can collapse nested values into `[Object]` and `[Array]`. This is only a display shortcut; the data is still present. Use either of these forms to display everything:

```js
console.dir(generateTricks("38 + 27"), {
  depth: null,
  colors: true,
});
```

```js
console.log(JSON.stringify(generateTricks("38 + 27"), null, 2));
```

## `generateTricks` result

```ts
interface TrickAnalysis {
  calculation: Calculation;
  expression: string;
  answer: number;
  difficulty: Difficulty; // difficulty of the direct calculation
  tricks: readonly Trick[];
  metadata: {
    generatedCandidates: number;
    returnedTricks: number;
  };
}
```

Each `Trick` contains:

- `rule`: stable strategy identifier for future analytics;
- `expression`: short alternative to display immediately;
- `answer`: final result;
- `difficulty` and `improvement`: route score and savings over direct calculation;
- `steps`: atomic operations, intermediate results, and explanations;
- `tags`: categories that can later support training mode.

Available options:

```ts
generateTricks("24 * 25", {
  maxTricks: 5,
  minimumImprovement: 1,
  includeNonImproving: false,
});
```

By default, the engine returns at most eight strategies and keeps only those that save at least one point. `includeNonImproving: true` is useful when analyzing or testing every generated rule.

## Implemented strategies

| Operation | Rule families | Example |
| --- | --- | --- |
| Addition | compensation, near double, place-value decomposition | `38 + 27 → 40 + 25` |
| Subtraction | negative handling, compensation, round-and-correct, bridge, decomposition | `83 − 29 → 53 + 1` |
| Multiplication | sign handling, factor transfer, distributive property, difference of squares | `24 × 25 → 6 × 100` |
| Division | sign handling, common factor, scaling, sequential factors, partial quotients | `7.5 ÷ 0.25 → 30 ÷ 1` |

## Code organization

```text
src/
├── engine.ts       # orchestration, validation, ranking, and explanations
├── difficulty.ts   # mental-effort heuristic
├── math.ts         # safe calculation, normalization, and formatting
├── parser.ts       # input parsing and normalization
├── types.ts        # public contract and typed errors
└── rules/
    ├── addition.ts
    ├── subtraction.ts
    ├── multiplication.ts
    ├── division.ts
    ├── shared.ts   # shared step builders
    └── types.ts    # internal rule contracts
```

The processing flow is:

1. `parser.ts` converts the input into a canonical `Calculation`.
2. `math.ts` calculates and normalizes the direct answer.
3. The matching operation rule generates candidates and their atomic steps.
4. `engine.ts` recalculates every step, rejects any route whose final result is not equivalent, and deduplicates expressions.
5. `difficulty.ts` adds the mental cost of the steps, and the engine ranks the strategies.

The difficulty score is a **heuristic**, not a scientific measurement. Round numbers, small factors, doubles, and exact divisions cost less; general multi-digit operations cost more. Mathematical transformations remain independent from the score, so ranking can be tuned without changing the rules.

## Adding a rule

1. Add a generator to the relevant operation file.
2. Build each step with `makeStep` or `makeAdjustment`.
3. Give the rule a stable identifier such as `multiplication.factor-transfer`.
4. End the step list with an operation whose result is the final answer; the engine checks this invariant.
5. Add an example to `tests/rules.test.ts` and, when useful, add a value to the matrix in `tests/invariants.test.ts`.

## Numeric precision

The package uses JavaScript numbers (`number`) and removes common floating-point noise by normalizing to 15 significant digits, so `0.1 + 0.2` returns `0.3`. Operands and results must remain finite. Exact financial arithmetic or arbitrarily large values would require a dedicated decimal type and are outside the mental-math P0 scope.
