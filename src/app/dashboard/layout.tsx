"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgency = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      setUserEmail(session.user.email ?? null);

      const { data: agency } = await supabase
        .from("agencies")
        .select("name")
        .eq("user_id", session.user.id)
        .single();

      if (agency) {
        setAgencyName((agency as { name: string }).name);
      }
    };

    fetchAgency();
  }, []);

  return (
    <>
      {/* Dashboard sub-navigation bar */}
      <div className="border-b border-border-subtle bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm">
            {agencyName ? (
              <span className="font-medium text-foreground">{agencyName}</span>
            ) : (
              <span className="text-muted-foreground animate-pulse">
                Loading...
              </span>
            )}
            {userEmail && (
              <span className="hidden sm:inline text-muted-foreground">
                {userEmail}
              </span>
            )}
          </div>
          <a
            href="/dashboard/settings"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </a>
        </div>
      </div>
      {children}
    </>
  );
}
