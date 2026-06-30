"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import type { Submission, SubmissionStatus } from "@/lib/types";

// Sample data for demonstration
const SAMPLE_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    client_name: "Sarah Johnson",
    client_email: "sarah@acme.com",
    project_type: "Website Redesign",
    raw_brief:
      "We need a complete website redesign for our SaaS platform. The current site feels outdated and doesn't convert well. We want a modern, clean design with strong CTAs and improved information architecture. Target audience is mid-market B2B tech companies.",
    status: "pending_review",
    created_at: "2026-06-28T10:30:00Z",
    updated_at: "2026-06-28T10:30:00Z",
  },
  {
    id: "2",
    client_name: "Marcus Chen",
    client_email: "marcus@designlab.co",
    project_type: "Brand Identity",
    raw_brief:
      "Looking for a brand identity package including logo, color palette, typography system, and brand guidelines. We're a boutique design consultancy targeting high-end clients.",
    status: "analysed",
    created_at: "2026-06-27T14:00:00Z",
    updated_at: "2026-06-27T14:00:00Z",
  },
  {
    id: "3",
    client_name: "Emily Rodriguez",
    client_email: "emily@greenleaf.org",
    project_type: "Landing Page + Email",
    raw_brief:
      "Need a donation landing page and email campaign for our annual fundraising drive. Should be mobile-first and integrate with Stripe.",
    status: "ready_for_analysis",
    created_at: "2026-06-26T09:15:00Z",
    updated_at: "2026-06-26T09:15:00Z",
  },
  {
    id: "4",
    client_name: "Alex Thompson",
    client_email: "alex@thompson.dev",
    project_type: "Mobile App UI/UX",
    raw_brief:
      "Mobile app UI/UX design for a habit tracking app. Need wireframes, high-fidelity mockups, and a prototype.",
    status: "delivered",
    created_at: "2026-06-25T16:45:00Z",
    updated_at: "2026-06-25T16:45:00Z",
  },
];

const STATUS_TABS: { label: string; value: SubmissionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Analysed", value: "analysed" },
  { label: "Needs Clarification", value: "needs_clarification" },
  { label: "Ready for Analysis", value: "ready_for_analysis" },
  { label: "Delivered", value: "delivered" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<SubmissionStatus | "all">("all");
  const [submissions] = useState(SAMPLE_SUBMISSIONS);

  const filtered =
    activeTab === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeTab);

  const handleViewDetails = (id: string) => {
    window.location.href = `/dashboard/${id}`;
  };

  const handleApprove = (id: string) => {
    console.log("Approve:", id);
    alert(`Submission ${id} approved! (Demo)`);
  };

  const handleRequestChanges = (id: string) => {
    console.log("Request changes:", id);
    alert(`Changes requested for submission ${id}. (Demo)`);
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-white/[0.02] px-4 py-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-sm text-muted-foreground">
                  Last updated: just now
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Briefs",
                value: submissions.length,
                color: "text-foreground",
              },
              {
                label: "Pending Review",
                value: submissions.filter((s) => s.status === "pending_review")
                  .length,
                color: "text-amber-400",
              },
              {
                label: "Analysed",
                value: submissions.filter((s) => s.status === "analysed")
                  .length,
                color: "text-indigo-400",
              },
              {
                label: "Delivered",
                value: submissions.filter((s) => s.status === "delivered")
                  .length,
                color: "text-emerald-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
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
        {filtered.length === 0 ? (
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
              {activeTab === "all"
                ? "No client briefs have been submitted yet."
                : `No briefs with status "${activeTab}" found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((submission) => (
              <ReviewCard
                key={submission.id}
                submission={submission}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onRequestChanges={handleRequestChanges}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
