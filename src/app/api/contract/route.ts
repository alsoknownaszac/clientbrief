import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { randomUUID } from "crypto";

// GET — Look up a submission by portal_token (used by the public proposal page)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token parameter" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: submission, error } = await (
      supabase.from("submissions") as any
    )
      .select("*")
      .eq("portal_token", token)
      .single();

    if (error || !submission) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch proposal", message },
      { status: 500 },
    );
  }
}

// POST — Generate contract, accept proposal, or request changes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id, deposit_percentage = 30, action, feedback } = body;

    if (!submission_id) {
      return NextResponse.json(
        { success: false, error: "Missing submission_id" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();

    const { data: submission, error: fetchErr } = await (
      supabase.from("submissions") as any
    )
      .select("*")
      .eq("id", submission_id)
      .single();

    if (fetchErr || !submission) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 },
      );
    }

    // ── Handle "accept" action (client signs the proposal) ────────────
    if (action === "accept") {
      const { error: updateErr } = await (supabase.from("submissions") as any)
        .update({
          contract_status: "signed",
          contract_signed_at: new Date().toISOString(),
          status: "contract_signed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", submission_id);

      if (updateErr) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update submission",
            details: updateErr,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        action: "accepted",
        contract_signed_at: new Date().toISOString(),
      });
    }

    // ── Handle "request_changes" action ───────────────────────────────
    if (action === "request_changes") {
      if (!feedback) {
        return NextResponse.json(
          { success: false, error: "Missing feedback" },
          { status: 400 },
        );
      }

      // Enforce 3-change-request limit
      const currentCount = (submission.change_request_count as number) ?? 0;
      if (currentCount >= 3) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You have reached the maximum of 3 change requests. Please accept the proposal or contact the agency directly.",
          },
          { status: 400 },
        );
      }

      const { error: updateErr } = await (supabase.from("submissions") as any)
        .update({
          client_feedback: feedback,
          status: "pending_review",
          change_request_count: currentCount + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", submission_id);

      if (updateErr) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update submission",
            details: updateErr,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        action: "changes_requested",
        change_request_count: currentCount + 1,
        remaining_changes: 3 - (currentCount + 1),
      });
    }

    // ── Handle "reject" action ────────────────────────────────────────
    if (action === "reject") {
      const { error: updateErr } = await (supabase.from("submissions") as any)
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", submission_id);

      if (updateErr) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update submission",
            details: updateErr,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        action: "rejected",
      });
    }

    // ── Default: Generate contract (existing logic) ───────────────────

    if (!submission.scope_document || !submission.analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "Scope document and analysis must be generated first",
        },
        { status: 400 },
      );
    }

    const analysis = submission.analysis as Record<string, unknown>;
    const budget = (analysis.estimated_budget_usd as Record<
      string,
      number
    >) ?? {
      low: 0,
    };
    const totalWeeks = analysis.total_duration_weeks as number;
    const summary = analysis.project_summary as string;

    // Calculate deposit amount
    const projectTotal = budget.low ?? 0;
    const depositAmount = Math.round(projectTotal * (deposit_percentage / 100));

    // Generate contract markdown
    const contractMarkdown = `# PROJECT SERVICES AGREEMENT

**Date:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

**Between:**
- **Agency:** [Agency Name]
- **Client:** ${submission.client_name} (${submission.client_email})

---

## 1. Project Overview
${summary}

## 2. Scope of Work
${submission.scope_document}

## 3. Timeline
Estimated duration: **${totalWeeks} weeks**

## 4. Pricing & Payment Terms
- **Total Project Estimate:** $${projectTotal.toLocaleString()}
- **Deposit Required to Start:** $${depositAmount.toLocaleString()} (${deposit_percentage}% of total)
- **Deposit Due:** Upon signing this agreement
- **Remaining Balance:** Invoiced per phase upon completion
- **Payment Terms:** Net 15 days

## 5. Acceptance
By signing below, the Client agrees to the scope, timeline, and payment terms outlined in this agreement.

**Client Signature:** ___________________________ **Date:** _______________

**Agency Signature:** ___________________________ **Date:** _______________

---

*This agreement is governed by the laws of the agency's jurisdiction. Either party may terminate with 14 days written notice. Work completed up to the termination date shall be invoiced and payable.*
`;

    // Generate portal token for client access
    const portalToken = randomUUID();

    const { error: updateErr } = await (supabase.from("submissions") as any)
      .update({
        contract_status: "sent",
        deposit_amount: depositAmount,
        portal_token: portalToken,
        status: "contract_sent",
        updated_at: new Date().toISOString(),
      })
      .eq("id", submission_id);

    if (updateErr) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update submission",
          details: updateErr,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      contract: contractMarkdown,
      deposit_amount: depositAmount,
      deposit_percentage,
      portal_token: portalToken,
      portal_url: `/proposal/${portalToken}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to process contract action", message },
      { status: 500 },
    );
  }
}
