"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentPreview } from "@/components/DocumentPreview";
import type { Submission } from "@/lib/types";

export default function ProposalPortalPage() {
  const params = useParams();
  const token = params.token as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchProposal() {
      try {
        const res = await fetch(`/api/contract?token=${token}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || "Proposal not found.");
          return;
        }

        setSubmission(data.submission);
      } catch {
        setError("Could not load the proposal. Please check your link.");
      } finally {
        setLoading(false);
      }
    }

    fetchProposal();
  }, [token]);

  const handleAccept = async () => {
    if (!submission) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submission.id,
          action: "accept",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Could not process your acceptance.");
        return;
      }

      setActionSuccess(
        "Thank you! Your proposal has been accepted. Our team will be in touch shortly to finalise the next steps.",
      );
      setSubmission({
        ...submission,
        contract_status: "signed",
        contract_signed_at: new Date().toISOString(),
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!submission) return;
    if (
      !confirm(
        "Are you sure you want to reject this proposal? This cannot be undone.",
      )
    )
      return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submission.id,
          action: "reject",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Could not reject the proposal.");
        return;
      }

      setActionSuccess(
        "You have rejected this proposal. The agency has been notified.",
      );
      setSubmission({
        ...submission,
        status: "rejected",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Stripe payment disabled for MVP v1.0
  // const handlePay = async () => { ... };

  const handleRequestChanges = async () => {
    if (!submission || !feedback.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submission.id,
          action: "request_changes",
          feedback,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Could not submit your feedback.");
        return;
      }

      setActionSuccess(
        "Your feedback has been sent to the agency. They will review your request and get back to you shortly.",
      );
      setSubmission({
        ...submission,
        client_feedback: feedback,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <svg
            className="mx-auto h-8 w-8 animate-spin text-indigo-400"
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
          <p className="text-sm text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card max-w-md text-center space-y-4 p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Proposal Not Found
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error ||
              "This proposal link may have expired or is no longer available. Please reach out to your agency contact."}
          </p>
        </div>
      </div>
    );
  }

  if (!submission) return null;

  const isAlreadySigned = submission.contract_status === "signed";
  const clientName = submission.client_name;
  const projectType = submission.project_type ?? "your project";

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-1.5 text-sm text-emerald-400">
            <span className="status-dot-emerald" />
            Proposal Ready for Review
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hi {clientName} — here is your {projectType.toLowerCase()} proposal
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Below you will find a complete scope of work with phased timeline
            and a draft invoice. Review at your convenience — once you are
            happy, accept the proposal to get started.
          </p>
        </div>

        {/* Success banner */}
        {actionSuccess && (
          <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
            <svg
              className="mx-auto mb-2 h-8 w-8 text-emerald-400"
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
            <p className="text-sm text-emerald-400 leading-relaxed">
              {actionSuccess}
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Already signed notice */}
        {isAlreadySigned && (
          <div className="mb-8 space-y-6">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.05] p-5 text-center">
              <svg
                className="mx-auto mb-2 h-8 w-8 text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm text-indigo-400 font-medium">
                Proposal accepted — thank you! The team will reach out to
                schedule the kickoff shortly.
              </p>
              {submission.contract_signed_at && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepted on{" "}
                  {new Date(submission.contract_signed_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              )}
            </div>

            {/* ── Stripe deposit payment — disabled for MVP v1.0 ── */}
            {!submission.deposit_paid && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
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
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-400">
                      Deposit Payment
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stripe payments are coming in v2.0. For now, the agency
                      will handle payment off-platform.
                    </p>
                  </div>
                </div>
                {submission.analysis && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border-subtle bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-muted-foreground">
                        Deposit Amount
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        $
                        {(
                          submission.deposit_amount ||
                          Math.round(
                            (submission.analysis.estimated_budget_usd.low ||
                              0) * 0.3,
                          ) ||
                          "—"
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border-subtle bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-muted-foreground">
                        Remaining After Deposit
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        $
                        {(
                          (submission.analysis.estimated_budget_usd.low || 0) -
                          (submission.deposit_amount ||
                            Math.round(
                              (submission.analysis.estimated_budget_usd.low ||
                                0) * 0.3,
                            ))
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  ⏳ Online deposit payment will be available in a future
                  update. The agency will contact you to arrange payment.
                </p>
              </div>
            )}

            {submission.deposit_paid && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5 text-center">
                <svg
                  className="mx-auto mb-2 h-8 w-8 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-sm text-emerald-400 font-medium">
                  Proposal accepted and deposit paid — thank you! The team will
                  reach out to schedule the kickoff shortly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Project overview */}
        {submission.analysis && (
          <div className="card mb-8 space-y-4">
            <h2 className="heading-md text-foreground">Project Overview</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {submission.analysis.project_summary}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border-subtle bg-white/[0.02] px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Complexity</p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {submission.analysis.complexity}
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-white/[0.02] px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                <p className="text-sm font-medium text-foreground">
                  {submission.analysis.total_duration_weeks} weeks
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-white/[0.02] px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Estimated Budget
                </p>
                <p className="text-sm font-medium text-foreground">
                  $
                  {submission.analysis.estimated_budget_usd.low.toLocaleString()}
                  –$
                  {submission.analysis.estimated_budget_usd.high.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Phases */}
            {submission.analysis.phases.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Development Phases
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
            )}
          </div>
        )}

        {/* Documents */}
        <div className="grid gap-8 sm:grid-cols-2 mb-8">
          {submission.scope_document && (
            <DocumentPreview
              title="Scope of Work"
              content={submission.scope_document}
            />
          )}
          {submission.invoice_draft && (
            <DocumentPreview
              title="Invoice Draft"
              content={submission.invoice_draft}
            />
          )}
        </div>

        {/* Actions */}
        {!isAlreadySigned && !actionSuccess && (
          <div className="card space-y-6">
            <h2 className="heading-md text-foreground">Next Steps</h2>
            <div className="grid gap-4">
              {/* Accept */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400">
                    Accept Proposal
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    I have reviewed the scope of work and invoice, and I am
                    ready to move forward.
                  </p>
                </div>
                <button
                  onClick={handleAccept}
                  disabled={submitting}
                  className="btn-primary w-full text-sm"
                >
                  {submitting ? (
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
                      Processing...
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
                      I Accept — Let&rsquo;s Start
                    </>
                  )}
                </button>
              </div>

              {/* Reject Proposal */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.02] p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-red-400">
                    Reject Proposal
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    This proposal does not meet your needs. Rejecting cannot be
                    undone.
                  </p>
                </div>
                <button
                  onClick={handleReject}
                  disabled={submitting}
                  className="btn-ghost w-full text-sm text-red-400 hover:text-red-300"
                >
                  {submitting ? (
                    <>Processing...</>
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
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject
                    </>
                  )}
                </button>
              </div>

              {/* Request Changes */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-amber-400">
                    Request Changes
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Something is not quite right? Let the agency know what needs
                    to be adjusted. You can request up to 3 changes.
                  </p>
                  {submission.change_request_count != null &&
                    submission.change_request_count > 0 && (
                      <p className="text-xs text-amber-400/70">
                        {submission.change_request_count} of 3 changes used
                        &middot; {3 - submission.change_request_count} remaining
                      </p>
                    )}
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What would you like changed? (e.g., timeline adjustment, scope clarification, budget discussion)"
                  rows={3}
                  className="input-field min-h-[80px] resize-y"
                />
                <button
                  onClick={handleRequestChanges}
                  disabled={submitting || !feedback.trim()}
                  className="btn-secondary w-full text-sm text-amber-400 hover:text-amber-300"
                >
                  {submitting ? (
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Send Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
