import { forwardRef, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, id, className = "", ...props }, ref) {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-[13.5px] font-medium text-current/80"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-[14.5px] text-current placeholder:text-current/35 dark:border-ink-line dark:bg-ink-surface ${className}`}
          {...props}
        />
        {hint ? (
          <span className="text-[12.5px] text-current/45">{hint}</span>
        ) : null}
      </div>
    );
  }
);
