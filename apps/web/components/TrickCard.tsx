import type { DifficultyLevel, Trick } from "trick-engine";

interface TrickCardProps {
  readonly trick: Trick;
  readonly originalExpression: string;
  readonly rank: number;
  readonly detailed: boolean;
}

const DIFFICULTY_DOTS: Readonly<Record<DifficultyLevel, number>> = {
  "very-easy": 1,
  easy: 1,
  medium: 2,
  hard: 3,
};

function DifficultyDots({ level }: Readonly<{ level: DifficultyLevel }>) {
  const filled = DIFFICULTY_DOTS[level];

  return (
    <span
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`Difficulty ${filled} out of 3`}
    >
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`size-2.5 rounded-full border ${
            dot <= filled ? "border-accent bg-accent" : "border-zinc-300 bg-transparent"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function TrickCard({
  trick,
  originalExpression,
  rank,
  detailed,
}: TrickCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-300 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
          Route {String(rank).padStart(2, "0")}
        </span>
        <DifficultyDots level={trick.difficulty.level} />
      </div>

      <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl">{trick.title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-zinc-600">{trick.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-base sm:text-lg">
        <span className="text-zinc-400 line-through decoration-zinc-400 decoration-2">
          {originalExpression}
        </span>
        <span className="text-zinc-400" aria-hidden="true">
          →
        </span>
        <strong className="text-accent">{trick.expression}</strong>
      </div>

      <div className="mt-5 border-l-4 border-accent pl-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Answer</p>
        <p className="mt-1 font-mono text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {trick.answer}
        </p>
      </div>

      {detailed ? (
        <ol className="mt-6 space-y-3 border-t border-zinc-200 pt-5">
          {trick.steps.map((step, index) => (
            <li key={`${step.expression}-${index}`} className="grid grid-cols-[1.75rem_1fr] gap-3">
              <span className="grid size-7 place-items-center rounded-full border border-zinc-300 font-mono text-xs font-bold text-zinc-600">
                {index + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-sm font-bold text-ink sm:text-base">
                  {step.expression} = {step.result}
                </p>
                <p className="mt-1 text-sm leading-5 text-zinc-600">{step.explanation}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}
