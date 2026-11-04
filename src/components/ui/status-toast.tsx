"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "success" | "error" | "warning" | "info";

type ToastMessage = {
  id: string;
  kind: ToastKind;
  title: string;
  message: string;
  statusCode?: number;
};

type ShowToastOptions = {
  kind: ToastKind;
  title: string;
  message: string;
  statusCode?: number;
  duration?: number;
};

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const styles: Record<
  ToastKind,
  {
    border: string;
    icon: string;
    label: string;
  }
> = {
  success: {
    border: "border-emerald-500",
    icon: "✓",
    label: "Success",
  },
  error: {
    border: "border-red-500",
    icon: "!",
    label: "Error",
  },
  warning: {
    border: "border-amber-500",
    icon: "⚠",
    label: "Attention",
  },
  info: {
    border: "border-sky-500",
    icon: "i",
    label: "Notice",
  },
};

export function StatusToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = crypto.randomUUID();

    setToast({
      id,
      kind: options.kind,
      title: options.title,
      message: options.message,
      statusCode: options.statusCode,
    });

    const duration = options.duration ?? 4500;

    if (duration > 0) {
      window.setTimeout(() => {
        setToast((current) => current?.id === id ? null : current);
      }, duration);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ showToast }),
    [showToast],
  );

  useEffect(() => {
    if (!toast) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dismissToast();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [toast, dismissToast]);

  const style = toast ? styles[toast.kind] : null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {toast && style && (
        <div className="pointer-events-none fixed right-4 top-4 z-[100] w-[min(24rem,calc(100vw-2rem))]">
          <div
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
            aria-live={toast.kind === "error" ? "assertive" : "polite"}
            aria-atomic="true"
            className={`pointer-events-auto rounded-xl border border-neutral-200 border-l-4 ${style.border} bg-white p-4 text-neutral-900 shadow-xl shadow-black/10`}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${style.border} text-sm font-bold`}
              >
                {style.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold">
                    {toast.title || style.label}
                  </p>

                  {toast.statusCode !== undefined && (
                    <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-600">
                      {toast.statusCode}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm leading-5 text-neutral-600">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={dismissToast}
                aria-label="Dismiss notification"
                className="rounded-md px-2 py-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useStatusToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useStatusToast must be used inside StatusToastProvider.",
    );
  }

  return context;
}