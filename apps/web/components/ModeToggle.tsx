export type DisplayMode = "quick" | "detailed";

interface ModeToggleProps {
  readonly mode: DisplayMode;
  readonly onChange: (mode: DisplayMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-zinc-300 bg-white p-0.5"
      role="group"
      aria-label="Explanation detail"
    >
      {(["quick", "detailed"] as const).map((option) => (
        <button
          key={option}
          className={`min-h-8 rounded-full px-3 text-[0.7rem] font-bold capitalize transition-colors ${
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
