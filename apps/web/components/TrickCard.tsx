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
          className={`size-2 rounded-full border ${
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
  const isBest = rank === 1;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white ${
        isBest ? "border-accent" : "border-zinc-300"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span
            className={`rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
              isBest ? "bg-accent text-white" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {isBest ? "Best route" : `Route ${String(rank).padStart(2, "0")}`}
          </span>
          <DifficultyDots level={trick.difficulty.level} />
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div>
            <h3 className="text-lg font-bold tracking-[-0.02em] text-ink sm:text-xl">
              {trick.title}
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-5 text-zinc-600">
              {trick.summary}
            </p>
          </div>

          <div className="flex items-end justify-between gap-5 border-t border-zinc-200 pt-3.5 sm:block sm:min-w-28 sm:border-l sm:border-t-0 sm:py-0.5 sm:pl-5 sm:text-right">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.13em] text-zinc-400">
              Answer
            </p>
            <p className="font-mono text-3xl font-bold tracking-[-0.05em] text-ink sm:mt-1 sm:text-4xl">
              {trick.answer}
            </p>
          </div>
        </div>
      </div>

      <div className={`${isBest ? "bg-accent/[0.055]" : "bg-zinc-50"} px-4 py-3.5 sm:px-5`}>
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div className="min-w-0">
            <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Original
            </p>
            <p className="mt-1.5 break-words text-zinc-400 line-through decoration-zinc-400 decoration-2">
              {originalExpression}
            </p>
          </div>
          <div className="min-w-0 border-l border-zinc-200 pl-4">
            <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">
              Simpler
            </p>
            <p className="mt-1.5 break-words font-bold text-ink">{trick.expression}</p>
          </div>
        </div>
      </div>

      {detailed ? (
        <ol className="space-y-0 border-t border-zinc-200 px-4 py-1 sm:px-5">
          {trick.steps.map((step, index) => (
            <li
              key={`${step.expression}-${index}`}
              className="grid grid-cols-[1.75rem_1fr] gap-3 border-b border-zinc-200 py-3.5 last:border-b-0"
            >
              <span className="grid size-7 place-items-center rounded-full bg-accent/[0.09] font-mono text-[0.65rem] font-bold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-sm font-bold text-ink">
                  {step.expression} = {step.result}
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-600">{step.explanation}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}
