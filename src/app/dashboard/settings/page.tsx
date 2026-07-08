"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Agency } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [userEmail, setUserEmail] = useState("");
  // Stripe state disabled for MVP v1.0
  // const [stripeSecretKey, setStripeSecretKey] = useState("");
  // const [stripePublishableKey, setStripePublishableKey] = useState("");
  // const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
  // const [showStripeSecret, setShowStripeSecret] = useState(false);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push("/login");
          return;
        }

        setUserEmail(session.user.email ?? "");

        const { data, error: fetchError } = await supabase
          .from("agencies")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (fetchError || !data) {
          setError("Could not load agency profile.");
          return;
        }

        const agencyData = data as Agency;
        setAgency(agencyData);
        setName(agencyData.name);
        setPhone(agencyData.phone ?? "");
        setAddress(agencyData.address ?? "");
        setWebsite(agencyData.website ?? "");
        // Stripe keys disabled for MVP v1.0
        // setStripeSecretKey(agencyData.stripe_secret_key ?? "");
        // setStripePublishableKey(agencyData.stripe_publishable_key ?? "");
        // setStripeWebhookSecret(agencyData.stripe_webhook_secret ?? "");
      } catch {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Agency name is required.");
      return;
    }

    if (!agency) return;

    // Stripe validation disabled for MVP v1.0
    setSaving(true);

    try {
      const res = await fetch("/api/agency/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: agency.user_id,
          name: name.trim(),
          phone,
          address,
          website,
          // Stripe keys not sent in MVP v1.0
          stripe_secret_key: null,
          stripe_publishable_key: null,
          stripe_webhook_secret: null,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "Failed to save settings.");
        setSaving(false);
        return;
      }

      // Update local agency state with returned data
      if (result.agency) {
        setAgency({ ...agency, ...result.agency });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-white/[0.05]" />
            <div className="h-64 rounded-xl bg-white/[0.02] border border-border-subtle" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/4 blur-[150px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
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

        <div className="mb-10">
          <h1 className="heading-xl text-foreground">Agency Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your agency profile and payment configuration.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* ── Profile Section ────────────────────────────── */}
          <div className="card space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-xs text-muted-foreground mt-1">
                These details appear on proposals and invoices sent to clients.
              </p>
            </div>

            {/* Read-only: Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Account Email
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="input-field opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Your login email cannot be changed here.
              </p>
            </div>

            <div className="border-t border-border-subtle pt-6" />

            {/* Agency Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Agency Name <span className="text-indigo-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your agency name"
                className="input-field"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input-field"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-foreground"
              >
                Business Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Suite 100&#10;San Francisco, CA 94105"
                rows={2}
                className="input-field resize-y"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label
                htmlFor="website"
                className="text-sm font-medium text-foreground"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://youragency.com"
                className="input-field"
              />
            </div>
          </div>

          {/* ── Stripe Configuration — disabled for MVP v1.0 ── */}
          {/* <div className="card space-y-6"> */}
          {/*   <div> */}
          {/*     <h2 className="text-lg font-semibold text-foreground">Stripe Payments</h2> */}
          {/*     <p className="text-xs text-muted-foreground mt-1">Configure your Stripe account to accept deposit payments from clients. Your keys are stored securely and never shared.</p> */}
          {/*   </div> */}
          {/*   ... Stripe key fields will be available in a future version ... */}
          {/* </div> */}
          <div className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Stripe Payments
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Stripe payments (deposit) are coming in a future version. For
                now, clients accept proposals and the agency handles payment
                off-platform.
              </p>
            </div>
            <div className="rounded-lg border border-muted-foreground/20 bg-white/[0.02] px-4 py-3">
              <p className="text-xs text-muted-foreground">
                ⏳ Stripe integration is planned for v2.0. Agencies will be able
                to connect their own Stripe accounts and accept deposits
                directly through the proposal portal.
              </p>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="btn-ghost text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="btn-primary"
            >
              {saving ? (
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
                  Saving...
                </>
              ) : (
                <>
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
