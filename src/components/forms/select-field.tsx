import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, options, id, className = "", ...props }, ref) {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className="text-[13.5px] font-medium text-current/80"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-[14.5px] text-current dark:border-ink-line dark:bg-ink-surface ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
