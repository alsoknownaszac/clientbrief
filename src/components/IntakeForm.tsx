"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Web App",
  "Mobile App",
  "API Integration",
  "E-commerce",
  "Dashboard/Admin Tool",
  "Other",
] as const;

interface IntakeFormProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    project_type: string;
    brief: string;
  }) => void;
}

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [brief, setBrief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !brief) return;
    setIsSubmitting(true);
    onSubmit?.({ name, email, project_type: projectType, brief });
  };

  const isFormValid = name.trim() && email.trim() && brief.trim();

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Name & Email row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
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
          Project Type <span className="text-indigo-400">*</span>
        </label>
        <select
          id="project_type"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="input-field"
          required
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

      {/* Brief textarea */}
      <div className="space-y-2">
        <label htmlFor="brief" className="text-sm font-medium text-foreground">
          Tell us about your project <span className="text-indigo-400">*</span>
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Describe your project, goals, timeline, and any specific requirements you have in mind..."
          rows={6}
          className="input-field min-h-[160px] resize-y"
          required
        />
        <p className="text-xs text-muted-foreground">
          The more detail you provide, the better we can understand your needs.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="btn-primary w-full sm:w-auto"
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
            Analysing your brief...
          </>
        ) : (
          <>
            Submit Brief
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
          </>
        )}
      </button>
    </form>
  );
}
