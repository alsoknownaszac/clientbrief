"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { IntakeForm } from "@/components/IntakeForm";

export default function AgencyIntakePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [agency, setAgency] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data, error: fetchError } = await supabase
          .from("agencies")
          .select("id, name, slug")
          .eq("slug", slug)
          .single();

        if (fetchError || !data) {
          setError("Agency not found. Please check your intake link.");
          return;
        }

        setAgency(data as { id: string; name: string });
      } catch {
        setError("Could not connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [slug]);

  const handleSubmit = async (data: {
    name: string;
    email: string;
    project_type: string;
    tech_stack: string;
    starting_point: string;
    budget_range: string;
    brief: string;
  }) => {
    setSubmitError(null);
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
          tech_stack: data.tech_stack,
          starting_point: data.starting_point,
          budget_range: data.budget_range,
          agency_slug: slug,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setSubmitError(
          result.error || "Something went wrong. Please try again.",
        );
        return;
      }

      if (!result.actionable && result.questions?.length > 0) {
        // Store parsed data for the clarify page (needed for demo/non-db submissions)
        if (result.submission_id && result.parsed) {
          try {
            sessionStorage.setItem(
              `parsed-${result.submission_id}`,
              JSON.stringify(result.parsed),
            );
          } catch {
            // Ignore storage errors
          }
        }
        const params = new URLSearchParams({
          submission_id: result.submission_id,
          questions: JSON.stringify(result.questions),
        });
        router.push(`/clarify?${params.toString()}`);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    }
  };

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        </div>
        <div className="animate-spin h-8 w-8 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none">
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
        </div>
      </div>
    );
  }

  // ─── Agency not found ─────────────────────────────────────
  if (error || !agency) {
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
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Agency Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            {error || "The intake link you used is invalid or has expired."}
          </p>
        </div>
      </div>
    );
  }

  // ─── Success ──────────────────────────────────────────────
  if (success) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="card border-border/20 p-8 text-center sm:p-10 max-w-lg mx-auto">
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
              Brief submitted — {agency.name} is on it!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your brief is clear and actionable. {agency.name} will review it
              and you will receive a complete proposal with scope, timeline, and
              pricing shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Intake form ──────────────────────────────────────────
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
            <span className="status-dot-indigo" />
            Submitting to {agency.name}
          </div>
          <h1 className="mx-auto mb-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            Tell {agency.name} About Your Project
          </h1>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground leading-relaxed">
            Describe your app idea in plain English. {agency.name}
            's AI will analyse your brief, clarify anything that's vague, and
            prepare a complete proposal — no sales calls required.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 max-w-3xl mx-auto">
            {submitError}
          </div>
        )}

        <div className="card border-border/20 p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto">
          <IntakeForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
