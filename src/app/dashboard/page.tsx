"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { createBrowserClient } from "@supabase/ssr";
import type { Submission, SubmissionStatus } from "@/lib/types";

const STATUS_TABS: { label: string; value: SubmissionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Contract Sent", value: "contract_sent" },
  { label: "Contract Signed", value: "contract_signed" },
  { label: "Analysed", value: "analysed" },
  { label: "Needs Clarification", value: "needs_clarification" },
  { label: "Ready for Analysis", value: "ready_for_analysis" },
  { label: "Delivered", value: "delivered" },
  { label: "Rejected", value: "rejected" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<SubmissionStatus | "all">("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [agencySlug, setAgencySlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Get current user's agency
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: agency } = await supabase
        .from("agencies")
        .select("id, slug")
        .eq("user_id", session.user.id)
        .single();

      if (agency) {
        setAgencySlug((agency as { slug: string }).slug);

        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("agency_id", agency.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setSubmissions(data as Submission[]);
        }
        setLoading(false);
        return;
      }
    }

    // Fallback: no agency found, show empty
    setSubmissions([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filtered =
    activeTab === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeTab);

  const handleViewDetails = (id: string) => {
    window.location.href = `/dashboard/${id}`;
  };

  const handleCopyLink = () => {
    if (!agencySlug) return;
    const intakeUrl = `${window.location.origin}/intake/${agencySlug}`;
    navigator.clipboard.writeText(intakeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const intakeUrl = agencySlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/intake/${agencySlug}`
    : "";

  // Stats
  const stats = {
    total: submissions.length,
    pendingReview: submissions.filter((s) => s.status === "pending_review")
      .length,
    analysed: submissions.filter(
      (s) =>
        s.status === "analysed" ||
        s.status === "contract_sent" ||
        s.status === "contract_signed",
    ).length,
    delivered: submissions.filter((s) => s.status === "delivered").length,
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="heading-xl text-foreground">Dashboard</h1>
              <p className="text-base text-muted-foreground">
                Review and manage client briefs.
              </p>
            </div>
          </div>

          {/* Intake link card */}
          {agencySlug && (
            <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Your Intake Link
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Share this link with clients so they can submit briefs
                    directly to your agency.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={intakeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border-subtle bg-white/[0.05] px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/30 truncate max-w-[280px] sm:max-w-sm transition-colors"
                    title="Open your intake form in a new tab"
                  >
                    {intakeUrl}
                  </a>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCopyLink();
                    }}
                    className="btn-secondary text-xs shrink-0"
                  >
                    {copied ? (
                      <>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-emerald-400"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
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
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <a
                    href={intakeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-xs shrink-0"
                    title="Preview your intake form"
                  >
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Briefs",
                value: stats.total,
                color: "text-foreground",
              },
              {
                label: "Pending Review",
                value: stats.pendingReview,
                color: "text-amber-400",
              },
              {
                label: "In Progress",
                value: stats.analysed,
                color: "text-indigo-400",
              },
              {
                label: "Delivered",
                value: stats.delivered,
                color: "text-emerald-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {loading ? "—" : stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 overflow-x-auto rounded-xl border border-border-subtle bg-white/[0.02] p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submissions list */}
        {loading ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="h-8 w-8 animate-spin text-muted-foreground"
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
            <p className="mt-4 text-sm text-muted-foreground">
              Loading briefs...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No briefs found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === "all" ? (
                agencySlug ? (
                  <span>
                    No client briefs have been submitted yet.{" "}
                    <button
                      onClick={handleCopyLink}
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                    >
                      {copied ? "Link copied!" : "Copy your intake link"}
                    </button>{" "}
                    to share with clients.
                  </span>
                ) : (
                  "No client briefs have been submitted yet. Share your intake form link with clients to get started."
                )
              ) : (
                `No briefs with status "${activeTab}" found.`
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((submission) => (
              <ReviewCard
                key={submission.id}
                submission={submission}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
