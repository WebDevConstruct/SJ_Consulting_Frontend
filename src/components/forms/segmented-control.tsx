interface SegmentedControlProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  name,
}: SegmentedControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13.5px] font-medium text-current/80">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 gap-2 rounded-sm border border-paper-line bg-paper p-1 dark:border-ink-line dark:bg-ink-surface"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              name={name}
              onClick={() => onChange(option.value)}
              className={`focus-gold rounded-sm px-4 py-2.5 text-[13.5px] font-medium transition-colors ${
                active
                  ? "bg-gold-metal-soft text-ink"
                  : "text-current/60 hover:text-current"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
