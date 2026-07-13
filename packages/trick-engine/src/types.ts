/** The four operations supported by the P0 engine. */
export type ArithmeticOperator = "+" | "-" | "*" | "/";

/** Symbols accepted when a calculation is provided as an object. */
export type OperatorInput =
  | ArithmeticOperator
  | "x"
  | "X"
  | "×"
  | "÷"
  | ":";

export interface Calculation {
  readonly left: number;
  readonly operator: ArithmeticOperator;
  readonly right: number;
}

export interface CalculationInput {
  readonly left: number;
  readonly operator: OperatorInput;
  readonly right: number;
}

export type DifficultyLevel = "very-easy" | "easy" | "medium" | "hard";

/** A lower score means less mental effort. */
export interface Difficulty {
  readonly score: number;
  readonly level: DifficultyLevel;
}

export interface TrickStep {
  readonly expression: string;
  readonly result: number;
  readonly explanation: string;
}

export interface Trick {
  /** Stable identifier within one analysis result. */
  readonly id: string;
  /** Stable rule identifier, suitable for analytics. */
  readonly rule: string;
  readonly title: string;
  readonly summary: string;
  readonly expression: string;
  readonly answer: number;
  readonly difficulty: Difficulty;
  /** Positive values indicate an easier route than the direct calculation. */
  readonly improvement: number;
  readonly steps: readonly TrickStep[];
  readonly tags: readonly string[];
}

export interface TrickAnalysis {
  readonly calculation: Calculation;
  readonly expression: string;
  readonly answer: number;
  readonly difficulty: Difficulty;
  /** Strategies sorted from the easiest to the hardest. */
  readonly tricks: readonly Trick[];
  readonly metadata: {
    readonly generatedCandidates: number;
    readonly returnedTricks: number;
  };
}

export interface GenerateTricksOptions {
  /** Maximum number of returned strategies. Defaults to 8. */
  readonly maxTricks?: number;
  /** Keep strategies that are not easier than the original. Defaults to false. */
  readonly includeNonImproving?: boolean;
  /** Minimum score saved by a strategy. Defaults to 1. */
  readonly minimumImprovement?: number;
}

export type TrickEngineErrorCode =
  | "INVALID_EXPRESSION"
  | "INVALID_OPERAND"
  | "UNSUPPORTED_OPERATOR"
  | "DIVISION_BY_ZERO"
  | "NON_FINITE_RESULT"
  | "INVALID_OPTIONS";

export class TrickEngineError extends Error {
  public readonly code: TrickEngineErrorCode;

  public constructor(code: TrickEngineErrorCode, message: string) {
    super(message);
    this.name = "TrickEngineError";
    this.code = code;
  }
}

export type CalculationSource = string | CalculationInput;
