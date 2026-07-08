import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      name,
      phone,
      address,
      website,
      stripe_secret_key,
      stripe_publishable_key,
      stripe_webhook_secret,
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "Missing user_id" },
        { status: 400 },
      );
    }

    if (name && (typeof name !== "string" || name.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: "Name must not be empty" },
        { status: 400 },
      );
    }

    // Validate Stripe keys if provided
    if (stripe_secret_key && typeof stripe_secret_key === "string") {
      const trimmed = stripe_secret_key.trim();
      if (trimmed && !trimmed.startsWith("sk_") && !trimmed.startsWith("rk_")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid Stripe secret key. It should start with 'sk_' or 'rk_'.",
          },
          { status: 400 },
        );
      }
    }

    if (stripe_publishable_key && typeof stripe_publishable_key === "string") {
      const trimmed = stripe_publishable_key.trim();
      if (trimmed && !trimmed.startsWith("pk_")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid Stripe publishable key. It should start with 'pk_'.",
          },
          { status: 400 },
        );
      }
    }

    if (stripe_webhook_secret && typeof stripe_webhook_secret === "string") {
      const trimmed = stripe_webhook_secret.trim();
      if (trimmed && !trimmed.startsWith("whsec_")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid Stripe webhook secret. It should start with 'whsec_'.",
          },
          { status: 400 },
        );
      }
    }

    // Build update object — only include fields that were provided
    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone || null;
    if (address !== undefined) updateData.address = address || null;
    if (website !== undefined) updateData.website = website || null;
    if (stripe_secret_key !== undefined)
      updateData.stripe_secret_key = stripe_secret_key?.trim() || null;
    if (stripe_publishable_key !== undefined)
      updateData.stripe_publishable_key =
        stripe_publishable_key?.trim() || null;
    if (stripe_webhook_secret !== undefined)
      updateData.stripe_webhook_secret = stripe_webhook_secret?.trim() || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 },
      );
    }

    // If name changed, regenerate slug
    if (name) {
      const cleanName = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);
      updateData.slug = cleanName + "-" + user_id.substring(0, 8);
    }

    const supabase = getSupabaseAdminClient();

    const { data: agency, error } = await (supabase.from("agencies") as any)
      .update(updateData)
      .eq("user_id", user_id)
      .select(
        "id, name, slug, phone, address, website, logo_url, user_id, stripe_publishable_key",
      )
      .single();

    if (error) {
      console.error("Failed to update agency:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, agency });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Agency update error:", message);
    return NextResponse.json(
      { success: false, error: "Failed to update agency", detail: message },
      { status: 500 },
    );
  }
}
