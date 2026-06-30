export type SubmissionStatus =
  | "needs_clarification"
  | "ready_for_analysis"
  | "analysed"
  | "pending_review"
  | "delivered";

export interface Submission {
  id: string;
  client_name: string;
  client_email: string;
  project_type?: string;
  raw_brief: string;
  status: SubmissionStatus;
  parsed_data?: ParsedData;
  clarification_questions?: string[];
  clarification_answers?: string[];
  analysis?: Analysis;
  scope_document?: string;
  invoice_draft?: string;
  created_at: string;
  updated_at: string;
}

export interface ParsedData {
  client_name: string;
  client_email: string;
  project_type: string;
  industry: string;
  core_problem: string;
  desired_outcome: string;
  timeline_mentioned: string | null;
  budget_mentioned: string | null;
  technical_details: string[];
  clarity_score: number;
}

export interface Analysis {
  project_summary: string;
  complexity: "simple" | "medium" | "complex";
  recommended_approach: string;
  phases: {
    name: string;
    description: string;
    duration_weeks: number;
    deliverables: string[];
  }[];
  total_duration_weeks: number;
  risk_flags: string[];
  estimated_budget_usd: {
    low: number;
    high: number;
  };
}
