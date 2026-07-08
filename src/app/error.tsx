"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-md px-4 text-center">
        <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-500/10">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-secondary text-sm">
          Try Again
        </button>
      </div>
    </div>
  );
}
