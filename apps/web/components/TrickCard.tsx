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
  const isBest = rank === 1;

  return (
    <article
      className={`overflow-hidden rounded-[1.75rem] border bg-white ${
        isBest ? "border-accent" : "border-zinc-300"
      }`}
    >
      <div className="p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span
            className={`rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] ${
              isBest ? "bg-accent text-white" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {isBest ? "Best route" : `Route ${String(rank).padStart(2, "0")}`}
          </span>
          <DifficultyDots level={trick.difficulty.level} />
        </div>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div>
            <h3 className="text-xl font-bold tracking-[-0.025em] text-ink sm:text-2xl">
              {trick.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              {trick.summary}
            </p>
          </div>

          <div className="flex items-end justify-between gap-5 border-t border-zinc-200 pt-4 sm:block sm:min-w-32 sm:border-l sm:border-t-0 sm:py-1 sm:pl-6 sm:text-right">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-400">
              Answer
            </p>
            <p className="font-mono text-4xl font-bold tracking-[-0.055em] text-ink sm:mt-1 sm:text-5xl">
              {trick.answer}
            </p>
          </div>
        </div>
      </div>

      <div className={`${isBest ? "bg-accent/[0.065]" : "bg-zinc-50"} px-5 py-4 sm:px-7 sm:py-5`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-base sm:text-lg">
          <span className="text-zinc-400 line-through decoration-zinc-400 decoration-2">
            {originalExpression}
          </span>
          <span
            className="grid size-7 place-items-center rounded-full bg-accent text-xs text-white"
            aria-hidden="true"
          >
            →
          </span>
          <strong className="text-ink">{trick.expression}</strong>
        </div>
      </div>

      {detailed ? (
        <ol className="space-y-0 border-t border-zinc-200 px-5 py-2 sm:px-7">
          {trick.steps.map((step, index) => (
            <li
              key={`${step.expression}-${index}`}
              className="grid grid-cols-[2rem_1fr] gap-3 border-b border-zinc-200 py-4 last:border-b-0 sm:gap-4"
            >
              <span className="grid size-8 place-items-center rounded-full bg-accent/[0.09] font-mono text-xs font-bold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-sm font-bold text-ink sm:text-base">
                  {step.expression} = {step.result}
                </p>
                <p className="mt-1.5 text-sm leading-5 text-zinc-600">{step.explanation}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}
