"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function SignupPage() {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Step 1: Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    if (!authData.user) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Step 2: Generate a slug from the agency name
    const slug =
      agencyName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50) +
      "-" +
      authData.user.id.substring(0, 8);

    // Step 3: Create the agency record with slug
    const { error: agencyError } = await supabase.from("agencies").insert({
      user_id: authData.user.id,
      name: agencyName,
      slug,
    });

    if (agencyError) {
      setError(
        "Account created but failed to set up agency. Please contact support.",
      );
      setIsSubmitting(false);
      return;
    }

    // Step 3: Redirect to dashboard
    router.push("/dashboard");
  };

  const isFormValid =
    agencyName.trim() && email.trim() && password && confirmPassword;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
            <span className="status-dot-indigo" />
            Agency Sign Up
          </div>
          <h1 className="heading-xl mb-2 text-foreground">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start automating your client intake today.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="agencyName"
              className="text-sm font-medium text-foreground"
            >
              Agency Name <span className="text-indigo-400">*</span>
            </label>
            <input
              id="agencyName"
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="e.g. DevForge Studio"
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
              placeholder="you@agency.com"
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password <span className="text-indigo-400">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="input-field"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirm Password <span className="text-indigo-400">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="btn-primary w-full"
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
