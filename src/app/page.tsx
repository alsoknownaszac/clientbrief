"use client";

import { useState } from "react";
import { IntakeForm } from "@/components/IntakeForm";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    email: string;
    project_type: string;
    brief: string;
  }) => {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: data.name,
          client_email: data.email,
          project_type: data.project_type,
          raw_brief: data.brief,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      // If clarification is needed, redirect to /clarify with questions
      if (!result.actionable && result.questions?.length > 0) {
        const params = new URLSearchParams({
          submission_id: result.submission_id,
          questions: JSON.stringify(result.questions),
        });
        router.push(`/clarify?${params.toString()}`);
        return;
      }

      // If actionable, show success message
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Hero section */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
            <span className="status-dot-indigo" />
            AI-Powered Onboarding
          </div>
          <h1 className="heading-xl mb-4 text-foreground">
            Tell us about your
            <br />
            <span className="text-indigo-400">next project</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            Share your vision and let our AI analyse your requirements. Your
            founder will review everything before we move forward.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success message */}
        {success ? (
          <div className="card border-border/20 p-8 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="heading-md mb-2 text-foreground">
              Brief submitted successfully!
            </h2>
            <p className="text-muted-foreground">
              Your brief is clear and actionable. The founder will review it
              shortly and get back to you.
            </p>
          </div>
        ) : (
          /* Form card */
          <div className="card border-border/20 p-6 sm:p-8 lg:p-10">
            <div className="mb-8 space-y-1">
              <h2 className="heading-md text-foreground">Project Brief</h2>
              <p className="text-sm text-muted-foreground">
                All fields marked with{" "}
                <span className="text-indigo-400">*</span> are required.
              </p>
            </div>
            <IntakeForm onSubmit={handleSubmit} />
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "Secure & Private",
              desc: "Your data is encrypted and never shared without your consent.",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ),
              title: "AI-Powered",
              desc: "Smart analysis extracts key requirements from your brief.",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
              title: "Founder Reviewed",
              desc: "Every brief is personally reviewed before we proceed.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-border-subtle bg-white/[0.02] p-4"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
