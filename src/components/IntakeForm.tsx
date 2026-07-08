"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Web App",
  "Mobile App",
  "SaaS Platform",
  "API / Backend",
  "E-commerce",
  "Dashboard / Admin Tool",
  "Landing Page / Website",
  "Other",
] as const;

const TECH_STACKS = [
  "No preference / Not sure",
  "React / Next.js",
  "Vue / Nuxt",
  "Angular",
  "Node.js / Express",
  "Python / Django / Flask",
  "Ruby on Rails",
  "Laravel / PHP",
  "React Native / Flutter",
  "Swift / Kotlin (Native)",
  "Other",
] as const;

const STARTING_POINTS = [
  "Greenfield — starting from scratch",
  "I have wireframes or designs ready",
  "I have an existing codebase to build on",
  "I need design + development",
] as const;

const BUDGET_RANGES = [
  "Not sure / To be discussed",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
] as const;

interface IntakeFormProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    project_type: string;
    tech_stack: string;
    starting_point: string;
    budget_range: string;
    brief: string;
  }) => void | Promise<void>;
}

function FieldSummary({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [step, setStep] = useState<"fill" | "review">("fill");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [techStack, setTechStack] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [brief, setBrief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formData = {
    name,
    email,
    project_type: projectType,
    tech_stack: techStack,
    starting_point: startingPoint,
    budget_range: budgetRange,
    brief,
  };

  const isFormValid = name.trim() && email.trim() && brief.trim();

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStep("review");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Step 1: Fill form ──────────────────────────────────
  if (step === "fill") {
    return (
      <form onSubmit={handleReview} className="w-full space-y-6">
        {/* Name & Email row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Your Name <span className="text-indigo-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="input-field"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email Address <span className="text-indigo-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@company.com"
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <label
            htmlFor="project_type"
            className="text-sm font-medium text-foreground"
          >
            Project Type
          </label>
          <select
            id="project_type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="input-field"
          >
            <option value="" disabled>
              Select a project type...
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Tech Stack & Starting Point row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="tech_stack"
              className="text-sm font-medium text-foreground"
            >
              Preferred Tech Stack
            </label>
            <select
              id="tech_stack"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="input-field"
            >
              <option value="" disabled>
                Select a tech stack...
              </option>
              {TECH_STACKS.map((stack) => (
                <option key={stack} value={stack}>
                  {stack}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="starting_point"
              className="text-sm font-medium text-foreground"
            >
              Starting Point
            </label>
            <select
              id="starting_point"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              className="input-field"
            >
              <option value="" disabled>
                Where are you starting from?
              </option>
              {STARTING_POINTS.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <label
            htmlFor="budget_range"
            className="text-sm font-medium text-foreground"
          >
            Budget Range
          </label>
          <select
            id="budget_range"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="input-field"
          >
            <option value="" disabled>
              Select a budget range...
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Brief textarea */}
        <div className="space-y-2">
          <label
            htmlFor="brief"
            className="text-sm font-medium text-foreground"
          >
            Tell us about your project{" "}
            <span className="text-indigo-400">*</span>
          </label>
          <textarea
            id="brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Describe your app idea — what problem does it solve? Who is it for? What features are essential? Any timeline or budget in mind?"
            rows={6}
            className="input-field min-h-[160px] resize-y"
            required
          />
          <p className="text-xs text-muted-foreground">
            The more detail you provide, the better we can scope and estimate
            your project. Tech specs, user stories, and competitor examples are
            especially helpful.
          </p>
        </div>

        {/* Submit / Review button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="btn-primary w-full sm:w-auto"
        >
          Review Brief
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
        </button>
      </form>
    );
  }

  // ─── Step 2: Review summary ─────────────────────────────
  return (
    <div className="card space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Review Your Brief
        </h3>
        <p className="text-sm text-muted-foreground">
          Make sure everything looks right before we analyse it.
        </p>
      </div>

      {/* Field summary grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldSummary label="Client Name" value={name} />
        <FieldSummary label="Email" value={email} />
        <FieldSummary label="Project Type" value={projectType} />
        <FieldSummary label="Tech Stack" value={techStack} />
        <FieldSummary label="Starting Point" value={startingPoint} />
        <FieldSummary label="Budget Range" value={budgetRange} />
      </div>

      {/* Brief in a bordered box */}
      {brief && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Project Description
          </p>
          <div className="rounded-xl border border-border-subtle bg-white/[0.02] p-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {brief}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep("fill")}
          disabled={isSubmitting}
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
          Go Back
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="btn-primary text-sm"
        >
          {isSubmitting ? (
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
              Submitting...
            </>
          ) : (
            <>
              Confirm & Submit
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
            </>
          )}
        </button>
      </div>
    </div>
  );
}
