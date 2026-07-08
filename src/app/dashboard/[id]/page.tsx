"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { StatusBadge } from "@/components/StatusBadge";
import { DocumentPreview } from "@/components/DocumentPreview";
import type { Submission } from "@/lib/types";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [analyseError, setAnalyseError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [delivering, setDelivering] = useState(false);
  const [deliverError, setDeliverError] = useState<string | null>(null);

  const fetchSubmission = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const { data, error: fetchError } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          setError("Submission not found.");
        } else {
          setError(fetchError.message);
        }
        return;
      }

      if (!data) {
        setError("Submission not found.");
        return;
      }

      setSubmission(data as Submission);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load submission.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const handleAnalyse = async () => {
    if (!submission) return;

    setAnalysing(true);
    setAnalyseError(null);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submission.id,
          parsed_data: submission.parsed_data,
          clarifications: submission.clarification_answers ?? undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setAnalyseError(result.error || "Failed to analyse brief.");
        setAnalysing(false);
        return;
      }

      await fetchSubmission();
    } catch (err) {
      setAnalyseError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    } finally {
      setAnalysing(false);
    }
  };

  const handleGenerate = async () => {
    if (!submission) return;

    setGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submission.id,
          parsed_data: submission.parsed_data,
          analysis: submission.analysis,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setGenerateError(result.error || "Failed to generate documents.");
        setGenerating(false);
        return;
      }

      await fetchSubmission();
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDeliver = async () => {
    if (!submission) return;

    setDelivering(true);
    setDeliverError(null);

    try {
      const res = await fetch("/api/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submission.id }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setDeliverError(result.error || "Failed to deliver proposal.");
        setDelivering(false);
        return;
      }

      // Refresh the submission to get updated status
      await fetchSubmission();
    } catch (err) {
      setDeliverError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    } finally {
      setDelivering(false);
    }
  };

  const handleDownloadDocument = (title: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-10">
            {/* Back button skeleton */}
            <div className="h-8 w-40 rounded-lg bg-white/[0.05]" />
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-9 w-64 rounded-lg bg-white/[0.05]" />
              <div className="h-5 w-96 rounded-lg bg-white/[0.05]" />
            </div>
            {/* Content skeleton */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-xl border border-border-subtle bg-white/[0.02] p-6">
                  <div className="h-6 w-32 rounded bg-white/[0.05]" />
                  <div className="mt-4 h-20 rounded bg-white/[0.03]" />
                </div>
                <div className="rounded-xl border border-border-subtle bg-white/[0.02] p-6">
                  <div className="h-6 w-32 rounded bg-white/[0.05]" />
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3 w-20 rounded bg-white/[0.05]" />
                        <div className="h-5 w-36 rounded bg-white/[0.03]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 rounded-xl bg-white/[0.02] border border-border-subtle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────
  if (error || !submission) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-ghost mb-8 text-sm"
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
            Back to Dashboard
          </button>
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
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
            <h3 className="text-lg font-semibold text-foreground">
              {error || "Submission not found"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The brief you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-secondary mt-6 text-sm"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Normal state ─────────────────────────────────────────────
  const date = new Date(submission.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="btn-ghost mb-8 text-sm"
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
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="heading-xl text-foreground">
                  {submission.client_name}
                </h1>
                <StatusBadge status={submission.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {submission.client_email}
                </span>
                {submission.project_type && (
                  <span className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {submission.project_type}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {date}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Step 3: Analyse Brief — visible when ready_for_analysis */}
              {submission.status === "ready_for_analysis" && (
                <button
                  className="btn-primary text-sm"
                  onClick={handleAnalyse}
                  disabled={analysing}
                >
                  {analysing ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Analysing...
                    </>
                  ) : (
                    <>
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
                        <polyline points="4 7 12 21 20 7" />
                        <polyline points="8 7 12 3 16 7" />
                      </svg>
                      Analyse Brief
                    </>
                  )}
                </button>
              )}

              {/* Step 4: Generate Documents — visible when analysed */}
              {submission.status === "analysed" && (
                <button
                  className="btn-primary text-sm"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
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
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      Generate Documents
                    </>
                  )}
                </button>
              )}

              {/* Step 5/6: Approve & Send — visible when pending_review */}
              {(submission.status === "pending_review" ||
                submission.status === "contract_sent") && (
                <button
                  className="btn-primary text-sm"
                  onClick={handleDeliver}
                  disabled={delivering}
                >
                  {delivering ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Approve & Send
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Action errors */}
          {analyseError && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {analyseError}
            </div>
          )}
          {generateError && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {generateError}
            </div>
          )}
          {deliverError && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {deliverError}
            </div>
          )}
        </div>

        {/* Content grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Original brief */}
            <div className="card space-y-4">
              <h2 className="heading-md text-foreground">Original Brief</h2>
              <div className="rounded-xl border border-border-subtle bg-white/[0.02] p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {submission.raw_brief}
                </p>
              </div>
            </div>

            {/* Parsed data */}
            {submission.parsed_data && (
              <div className="card space-y-5">
                <h2 className="heading-md text-foreground">Parsed Data</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Project Type
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.project_type}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Industry
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.industry}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tech Stack
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.tech_stack ??
                        submission.tech_stack ??
                        "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Starting Point
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.starting_point ??
                        submission.starting_point ??
                        "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Budget Range
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.budget_range ??
                        submission.budget_range ??
                        "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Timeline Mentioned
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.timeline_mentioned ??
                        "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Core Problem
                  </p>
                  <p className="text-sm text-foreground">
                    {submission.parsed_data.core_problem}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Desired Outcome
                  </p>
                  <p className="text-sm text-foreground">
                    {submission.parsed_data.desired_outcome}
                  </p>
                </div>

                {submission.parsed_data.technical_details.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Technical Details
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submission.parsed_data.technical_details.map(
                        (detail, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-lg border border-border-subtle bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {detail}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-white/[0.03] px-3 py-1.5 w-fit">
                  <span className="text-xs text-muted-foreground">
                    Clarity Score
                  </span>
                  <span className="text-sm font-semibold text-indigo-400">
                    {submission.parsed_data.clarity_score}/10
                  </span>
                </div>
              </div>
            )}

            {/* Clarification questions & answers */}
            {submission.clarification_questions &&
              submission.clarification_questions.length > 0 && (
                <div className="card space-y-4">
                  <h2 className="heading-md text-foreground">Clarification</h2>
                  <div className="space-y-3">
                    {submission.clarification_questions.map((q, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border-subtle bg-white/[0.02] p-4"
                      >
                        <p className="text-sm font-medium text-foreground">
                          Q: {q}
                        </p>
                        {submission.clarification_answers?.[i] && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            A: {submission.clarification_answers[i]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Analysis */}
            {submission.analysis ? (
              <div className="card space-y-5">
                <h2 className="heading-md text-foreground">AI Analysis</h2>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Project Summary
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {submission.analysis.project_summary}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-border-subtle bg-white/[0.03] px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">
                      Complexity:{" "}
                    </span>
                    <span className="text-sm font-medium text-foreground capitalize">
                      {submission.analysis.complexity}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border-subtle bg-white/[0.03] px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">
                      Duration:{" "}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {submission.analysis.total_duration_weeks} weeks
                    </span>
                  </div>
                  <div className="rounded-lg border border-border-subtle bg-white/[0.03] px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">
                      Budget:{" "}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      $
                      {submission.analysis.estimated_budget_usd.low.toLocaleString()}
                      – $
                      {submission.analysis.estimated_budget_usd.high.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Recommended Approach
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {submission.analysis.recommended_approach}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Phases
                  </p>
                  <div className="space-y-3">
                    {submission.analysis.phases.map((phase, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border-subtle bg-white/[0.02] p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-foreground">
                            {phase.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {phase.duration_weeks} week
                            {phase.duration_weeks > 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {phase.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.deliverables.map((d, j) => (
                            <span
                              key={j}
                              className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {submission.analysis.risk_flags.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-red-400">
                      Risk Flags
                    </p>
                    <ul className="space-y-2">
                      {submission.analysis.risk_flags.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
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
                            className="mt-0.5 shrink-0 text-red-400"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : submission.status === "analysed" ||
              submission.status === "pending_review" ||
              submission.status === "contract_sent" ||
              submission.status === "contract_signed" ||
              submission.status === "delivered" ? (
              <div className="card flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Analysis data not available for this submission.
                </p>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Generated documents */}
            {submission.scope_document && (
              <DocumentPreview
                title="Scope of Work"
                content={submission.scope_document}
                onDownload={() =>
                  handleDownloadDocument(
                    "Scope of Work",
                    submission.scope_document!,
                  )
                }
                onSend={handleDeliver}
              />
            )}

            {submission.invoice_draft && (
              <DocumentPreview
                title="Invoice Draft"
                content={submission.invoice_draft}
                onDownload={() =>
                  handleDownloadDocument(
                    "Invoice Draft",
                    submission.invoice_draft!,
                  )
                }
                onSend={handleDeliver}
              />
            )}

            {/* Quick actions */}
            <div className="card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  className="btn-primary w-full text-sm justify-start"
                  onClick={handleDeliver}
                  disabled={delivering}
                >
                  {delivering ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Approve & Send to Client
                    </>
                  )}
                </button>
                {submission.portal_token && (
                  <button
                    className="btn-secondary w-full text-sm justify-start"
                    onClick={() =>
                      window.open(
                        `/proposal/${submission.portal_token}`,
                        "_blank",
                      )
                    }
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview as Client
                  </button>
                )}
                <button className="btn-ghost w-full text-sm justify-start text-amber-400 hover:text-amber-300">
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Request Changes
                </button>
              </div>
            </div>

            {/* Payment/Contract Status — Stripe deposit disabled for MVP v1.0 */}
            {submission.contract_status && (
              <div className="card space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Contract Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-foreground capitalize">
                      {submission.contract_status}
                    </span>
                  </div>
                  {submission.contract_signed_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Signed</span>
                      <span className="font-medium text-foreground">
                        {new Date(
                          submission.contract_signed_at,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* ── Stripe payment status — disabled for MVP v1.0 ── */}
            {/* {(submission.deposit_paid !== undefined) && ( */}
            {/*   <div className="card space-y-3"> */}
            {/*     <h3 className="text-sm font-semibold text-foreground">Payment</h3> */}
            {/*     <div className="space-y-2 text-sm"> */}
            {/*       <div className="flex items-center justify-between"> */}
            {/*         <span className="text-muted-foreground">Deposit</span> */}
            {/*         <span className="font-medium text-foreground">${submission.deposit_amount?.toLocaleString() ?? "—"}</span> */}
            {/*       </div> */}
            {/*       <div className="flex items-center justify-between"> */}
            {/*         <span className="text-muted-foreground">Paid</span> */}
            {/*         <span className={`font-medium ${submission.deposit_paid ? "text-emerald-400" : "text-muted-foreground"}`}> */}
            {/*           {submission.deposit_paid ? "Yes" : "No"} */}
            {/*         </span> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </div> */}
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
