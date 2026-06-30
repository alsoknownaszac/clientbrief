"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { ClarifyStep } from "@/components/ClarifyStep";

function ClarifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const submissionId = searchParams.get("submission_id");
  const rawQuestions = searchParams.get("questions");

  let questions: string[] = [];
  try {
    if (rawQuestions) {
      const parsed = JSON.parse(rawQuestions);
      if (Array.isArray(parsed)) {
        questions = parsed;
      }
    }
  } catch {
    // fallback to empty
  }

  const handleComplete = async (answers: string[]) => {
    // Send the clarification answers back to the API for re-validation
    try {
      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submissionId,
          clarifications: answers,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        if (result.actionable) {
          alert(
            "Thanks for the additional details! Your brief is now ready for analysis.",
          );
          router.push("/");
        } else {
          // Still not actionable — show remaining questions
          const params = new URLSearchParams({
            submission_id: submissionId || "",
            questions: JSON.stringify(result.questions),
          });
          router.push(`/clarify?${params.toString()}`);
        }
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
            <span className="status-dot-amber" />
            Needs Clarification
          </div>
          <h1 className="heading-xl mb-4 text-foreground">
            A few quick <span className="text-indigo-400">clarifications</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            Your brief was a bit vague in some areas. Answer a few questions to
            help us better understand your project.
          </p>
        </div>

        {/* Clarification step component */}
        <ClarifyStep
          questions={questions}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default function ClarifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ClarifyContent />
    </Suspense>
  );
}
