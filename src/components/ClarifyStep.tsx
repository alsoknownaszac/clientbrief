"use client";

import { useState, useEffect, useRef } from "react";

interface ClarifyStepProps {
  questions: string[];
  submissionId?: string | null;
  onComplete?: (answers: string[]) => void;
  onBack?: () => void;
}

const STORAGE_PREFIX = "clarify-";

function makeStorageKey(submissionId?: string | null): string | null {
  if (!submissionId) return null;
  return `${STORAGE_PREFIX}${submissionId}`;
}

export function ClarifyStep({
  questions,
  submissionId,
  onComplete,
  onBack,
}: ClarifyStepProps) {
  const storageKey = makeStorageKey(submissionId);

  // Always start with empty/zero — restore from sessionStorage in useEffect
  // to avoid hydration mismatch (server has no sessionStorage).
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill(""),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track whether we've restored from storage yet
  const hasRestored = useRef(false);

  // Restore saved state from sessionStorage after hydration
  useEffect(() => {
    if (!storageKey || hasRestored.current) return;
    hasRestored.current = true;

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          answers: string[];
          currentIndex: number;
          questionCount: number;
        };
        // Only restore if the question count matches (same question set)
        if (
          parsed.questionCount === questions.length &&
          Array.isArray(parsed.answers)
        ) {
          setAnswers(parsed.answers);
          setCurrentIndex(
            Math.min(parsed.currentIndex ?? 0, questions.length - 1),
          );
        }
      }
    } catch {
      // Ignore corrupt storage
    }
  }, [storageKey, questions.length]);

  // Save answers + currentIndex to sessionStorage on every change
  // (only after initial restore)
  const isInitialised = useRef(false);
  useEffect(() => {
    if (!storageKey || !isInitialised.current) {
      isInitialised.current = true;
      return;
    }
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          answers,
          currentIndex,
          questionCount: questions.length,
        }),
      );
    } catch {
      // sessionStorage might be full (unlikely)
    }
  }, [answers, currentIndex, questions.length, storageKey]);

  // When questions change to a different set, reset answers
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { questionCount: number };
        if (parsed.questionCount !== questions.length) {
          setAnswers(new Array(questions.length).fill(""));
          setCurrentIndex(0);
          hasRestored.current = true; // prevent re-restore of stale data
        }
      }
    } catch {
      // Ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length, storageKey]);

  const updateAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const canProceed = answers[currentIndex]?.trim().length > 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete?.(answers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      // Clear saved answers when going back to brief
      if (storageKey) {
        sessionStorage.removeItem(storageKey);
      }
      onBack?.();
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card space-y-6">
        <div className="space-y-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-400">
            {currentIndex + 1}
          </div>
          <h3 className="heading-md text-foreground">
            {questions[currentIndex]}
          </h3>
        </div>

        <textarea
          value={answers[currentIndex]}
          onChange={(e) => updateAnswer(currentIndex, e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
          className="input-field min-h-[120px] resize-y"
          autoFocus
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="btn-ghost text-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {currentIndex === 0 ? "Back to brief" : "Previous"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="btn-primary text-sm"
          >
            {isLastQuestion ? "Complete" : "Next"}
            {!isLastQuestion && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
