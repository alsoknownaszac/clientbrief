"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { DocumentPreview } from "@/components/DocumentPreview";
import type { Submission } from "@/lib/types";

// Sample data — in production this would come from Supabase
const SAMPLE_SUBMISSION: Submission = {
  id: "1",
  client_name: "Sarah Johnson",
  client_email: "sarah@acme.com",
  project_type: "Website Redesign",
  raw_brief:
    "We need a complete website redesign for our SaaS platform. The current site feels outdated and doesn't convert well. We want a modern, clean design with strong CTAs and improved information architecture. Target audience is mid-market B2B tech companies.",
  status: "pending_review",
  parsed_data: {
    client_name: "Sarah Johnson",
    client_email: "sarah@acme.com",
    project_type: "Website Redesign",
    industry: "B2B SaaS",
    core_problem:
      "Current website feels outdated and has poor conversion rates",
    desired_outcome: "Modern, high-converting website with strong CTAs",
    timeline_mentioned: "ASAP, no specific deadline",
    budget_mentioned: "$15,000 - $25,000",
    technical_details: [
      "SaaS platform",
      "Responsive design",
      "CTA optimization",
      "Information architecture",
    ],
    clarity_score: 7.5,
  },
  analysis: {
    project_summary:
      "A mid-market B2B SaaS company needs a complete website redesign to improve conversion rates and modernize their online presence.",
    complexity: "medium",
    recommended_approach:
      "Start with a discovery phase to define conversion goals and content strategy before moving into design. Consider a phased approach to meet timeline constraints.",
    phases: [
      {
        name: "Discovery & Research",
        description:
          "Stakeholder interviews, competitor analysis, conversion audit",
        duration_weeks: 2,
        deliverables: ["Research report", "Conversion strategy", "Sitemap"],
      },
      {
        name: "UX & Design",
        description: "Wireframing, visual design, prototype",
        duration_weeks: 3,
        deliverables: [
          "Wireframes",
          "High-fidelity mockups",
          "Clickable prototype",
        ],
      },
      {
        name: "Development",
        description: "Front-end development, CMS integration, testing",
        duration_weeks: 3,
        deliverables: [
          "Developed pages",
          "Responsive implementation",
          "QA report",
        ],
      },
    ],
    total_duration_weeks: 8,
    risk_flags: [
      "Timeline may be tight for full redesign scope",
      "No mention of content strategy or copywriting",
    ],
    estimated_budget_usd: {
      low: 15000,
      high: 25000,
    },
  },
  scope_document:
    "# Scope of Work\n\n## 1. Project Overview\nA complete website redesign for Acme Inc.'s SaaS platform.\n\n## 2. Objectives\n- Modernize visual design\n- Improve conversion rates\n- Enhance information architecture\n\n## 3. Scope of Work\n### Phase 1: Discovery\n- Stakeholder interviews\n- Competitor analysis\n- Conversion audit\n\n### Phase 2: Design\n- Wireframing\n- Visual design\n- Interactive prototype\n\n### Phase 3: Development\n- Front-end development\n- Responsive implementation\n- QA and testing\n\n## 4. Out of Scope\n- Content creation/copywriting\n- Backend development\n- Third-party integrations\n- SEO services\n- Ongoing maintenance\n\n## 5. Timeline\n8 weeks total with phased delivery.\n\n## 6. Assumptions\n- Client will provide timely feedback within 48 hours\n- All brand assets are available\n- Content will be provided by client\n\n## 7. Next Steps\n1. Sign off on this scope of work\n2. Schedule kickoff meeting\n3. Begin Phase 1",
  invoice_draft:
    "# DRAFT INVOICE\n\n**Invoice:** INV-2026-8492\n**Date:** June 30, 2026\n\n**From:** [Agency Name]\n**To:** Sarah Johnson, Acme Inc.\n\n---\n\n| Line Item | Amount |\n|-----------|--------|\n| Phase 1: Discovery & Research | $4,000 |\n| Phase 2: UX & Design | $8,000 |\n| Phase 3: Development | $8,000 |\n| Project Management (10%) | $2,000 |\n| **Subtotal** | **$22,000** |\n| Estimated Tax (10%) | $2,200 |\n| **Total** | **$24,200** |\n\n---\n\n**Payment Terms:** Net 15\n\n*This is a DRAFT invoice and subject to final agreement.*",
  created_at: "2026-06-28T10:30:00Z",
  updated_at: "2026-06-28T10:30:00Z",
};

export default function SubmissionDetailPage() {
  const router = useRouter();
  const submission: Submission = SAMPLE_SUBMISSION;

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
              <button className="btn-secondary text-sm">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <button className="btn-primary text-sm">
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
              </button>
            </div>
          </div>
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
                      Timeline Mentioned
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.timeline_mentioned ??
                        "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Budget Mentioned
                    </p>
                    <p className="text-sm text-foreground">
                      {submission.parsed_data.budget_mentioned ??
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

            {/* Analysis */}
            {submission.analysis && (
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
                      ${submission.analysis.estimated_budget_usd.low}–$
                      {submission.analysis.estimated_budget_usd.high}
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Generated documents */}
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

            {/* Quick actions */}
            <div className="card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="btn-primary w-full text-sm justify-start">
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
                </button>
                <button className="btn-secondary w-full text-sm justify-start">
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
          </div>
        </div>
      </div>
    </div>
  );
}
