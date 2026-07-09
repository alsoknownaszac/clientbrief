export type SubmissionStatus =
  | "needs_clarification"
  | "ready_for_analysis"
  | "analysed"
  | "pending_review"
  | "contract_sent"
  | "contract_signed"
  | "delivered"
  | "rejected";

export type ContractStatus = "sent" | "signed" | null;

export interface Agency {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  website?: string;
  logo_url?: string;
  stripe_secret_key?: string;
  stripe_publishable_key?: string;
  stripe_webhook_secret?: string;
  created_at: string;
}

export interface Submission {
  id: string;
  client_name: string;
  client_email: string;
  project_type?: string;
  raw_brief: string;
  status: SubmissionStatus;
  tech_stack?: string;
  starting_point?: string;
  budget_range?: string;
  parsed_data?: ParsedData;
  clarification_questions?: string[];
  clarification_answers?: string[];
  analysis?: Analysis;
  scope_document?: string;
  invoice_draft?: string;
  contract_status?: ContractStatus;
  contract_signed_at?: string;
  stripe_payment_intent_id?: string;
  deposit_amount?: number;
  deposit_paid?: boolean;
  deposit_paid_at?: string;
  portal_token?: string;
  client_feedback?: string;
  change_request_count?: number;
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
  budget_range: string | null;
  tech_stack: string | null;
  starting_point: string | null;
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
