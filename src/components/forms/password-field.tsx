"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, hint, id, className = "", ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-[13.5px] font-medium text-current/80"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={`focus-gold w-full rounded-sm border border-paper-line bg-paper px-4 py-3 pr-11 text-base text-current placeholder:text-current/35 dark:border-ink-line dark:bg-ink-surface md:text-[14.5px] ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            tabIndex={-1}
            className="focus-gold absolute right-0 top-0 flex h-full w-11 items-center justify-center text-current/45 transition-colors hover:text-gold-500"
          >
            {visible ? (
              <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.6} />
            ) : (
              <Eye className="h-[18px] w-[18px]" strokeWidth={1.6} />
            )}
          </button>
        </div>
        {hint ? (
          <span className="text-[12.5px] text-current/45">{hint}</span>
        ) : null}
      </div>
    );
  }
);
