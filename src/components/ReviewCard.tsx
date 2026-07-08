import type { Submission } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface ReviewCardProps {
  submission: Submission;
  onViewDetails?: (id: string) => void;
}

export function ReviewCard({ submission, onViewDetails }: ReviewCardProps) {
  const date = new Date(submission.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="card-hover group">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Info */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {submission.client_name}
            </h3>
            <StatusBadge status={submission.status} size="sm" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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

          {/* Brief preview */}
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {submission.raw_brief}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
          <button
            onClick={() => onViewDetails?.(submission.id)}
            className="btn-primary text-sm whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
