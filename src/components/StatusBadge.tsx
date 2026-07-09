import type { SubmissionStatus } from "@/lib/types";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; dotClass: string }
> = {
  needs_clarification: {
    label: "Needs Clarification",
    dotClass: "status-dot-amber",
  },
  ready_for_analysis: {
    label: "Ready for Analysis",
    dotClass: "status-dot-indigo",
  },
  analysed: {
    label: "Analysed",
    dotClass: "status-dot-indigo",
  },
  pending_review: {
    label: "Pending Review",
    dotClass: "status-dot-amber",
  },
  contract_sent: {
    label: "Contract Sent",
    dotClass: "status-dot-amber",
  },
  contract_signed: {
    label: "Contract Signed",
    dotClass: "status-dot-indigo",
  },
  delivered: {
    label: "Delivered",
    dotClass: "status-dot-emerald",
  },
  rejected: {
    label: "Rejected",
    dotClass: "status-dot-red",
  },
};

interface StatusBadgeProps {
  status: SubmissionStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-3 py-1 ${textSize} font-medium text-muted-foreground`}
    >
      <span className={config.dotClass} />
      {config.label}
    </span>
  );
}
