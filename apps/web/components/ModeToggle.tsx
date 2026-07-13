export type DisplayMode = "quick" | "detailed";

interface ModeToggleProps {
  readonly mode: DisplayMode;
  readonly onChange: (mode: DisplayMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="inline-flex w-fit self-start rounded-xl bg-zinc-200/70 p-1"
      role="group"
      aria-label="Explanation detail"
    >
      {(["quick", "detailed"] as const).map((option) => (
        <button
          key={option}
          className={`min-h-8 rounded-lg px-3.5 text-[0.7rem] font-bold capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/35 ${
            mode === option
              ? "bg-accent text-white"
              : "text-zinc-600 hover:text-ink"
          }`}
          type="button"
          aria-pressed={mode === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
