export type DisplayMode = "quick" | "detailed";

interface ModeToggleProps {
  readonly mode: DisplayMode;
  readonly onChange: (mode: DisplayMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-zinc-300 bg-white p-1"
      role="group"
      aria-label="Explanation detail"
    >
      {(["quick", "detailed"] as const).map((option) => (
        <button
          key={option}
          className={`min-h-9 rounded-full px-3 text-xs font-bold capitalize transition-colors sm:px-4 ${
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
