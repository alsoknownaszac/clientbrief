export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* ─────────────────── HERO ─────────────────── */}
        <div className="mb-16 text-center sm:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
            <span className="status-dot-indigo" />
            Built for Software Development Agencies
          </div>
          <div className="mb-6">
            <a
              href="/signup"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Are you an agency? Sign up to get your own intake link
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            From vague app idea to
            <br />
            <span className="text-indigo-400">signed proposal</span> — in hours,
            not days
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
            ClientBrief is the client intake platform built for software
            development agencies. AI parses briefs, asks clarifying questions,
            breaks projects into phases with estimates, and generates scope of
            work and invoice drafts — so you spend 15 minutes reviewing instead
            of 4+ hours writing proposals from scratch.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Save 10+ hours per lead
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Never write a proposal from scratch
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Human reviews before anything is sent
            </span>
          </div>
        </div>

        {/* ─────────────────── WHO WE HELP ─────────────────── */}
        <div className="mb-20 grid gap-8 sm:grid-cols-2">
          <div className="card space-y-4 border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                For Web Dev Agencies & Software Shops
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your inbox is full of &ldquo;I need an app&rdquo; emails.
              ClientBrief turns each one into a structured brief, breaks it into
              phases with timeline and budget estimates, and generates a scope
              of work and draft invoice — all before you even open your laptop.
              You review, approve, and send. That is it.
            </p>
          </div>
          <div className="card space-y-4 border-emerald-500/20 bg-emerald-500/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                For Founders & Businesses Building Software
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have an idea for a web app, mobile app, or SaaS product.
              Describe it in your own words — no tech jargon required. Our AI
              extracts the key details, asks smart questions if needed, and
              delivers a complete proposal with scope, timeline, and pricing. No
              sales calls. No back-and-forth.
            </p>
          </div>
        </div>

        {/* ─────────────────── HOW IT WORKS ─────────────────── */}
        <div className="mb-20" id="how-it-works">
          <h2 className="heading-md mb-3 text-center text-foreground">
            How It Works
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            From client inquiry to proposal sent — all automated.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Client Fills a Brief",
                desc: "Your client describes their app idea in plain English. They can optionally share their tech stack preference, whether they have existing code or designs, and their budget range.",
              },
              {
                step: "2",
                title: "AI Clarifies What's Vague",
                desc: "The AI parses the brief, extracts technical requirements, and if anything is ambiguous it asks specific follow-up questions — no human loop involved.",
              },
              {
                step: "3",
                title: "AI Scopes, Prices & Flags Risks",
                desc: "The brief is broken into development phases with deliverables, week estimates, risk flags, and a budget range. A scope of work and draft invoice are generated.",
              },
              {
                step: "4",
                title: "You Review & Send",
                desc: "Everything lands in your dashboard. Review the AI's work, tweak anything, and click approve. The proposal is emailed to your client — professionally formatted.",
              },
            ].map((item) => (
              <div key={item.step} className="card group space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-lg font-bold text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  {item.step}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────── SOCIAL PROOF ─────────────────── */}
        <div className="mb-20">
          <h2 className="heading-md mb-3 text-center text-foreground">
            Trusted by Software Agencies
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            Agencies using ClientBrief close deals faster and spend less time on
            intake.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  "We used to spend 3–4 hours per lead just figuring out what they wanted. ClientBrief cut that to 15 minutes of review. It's a no-brainer for any dev shop.",
                name: "Marcus O.",
                role: "Founder, DevForge Studio",
              },
              {
                quote:
                  "The scope of work documents are better than what our PMs were writing manually. Clients love how fast we respond now.",
                name: "Priya K.",
                role: "CTO, Buildship Agency",
              },
              {
                quote:
                  "We handle 30+ inbound inquiries a month. Without ClientBrief we'd need two full-time PMs just for intake. Now it's one person, part-time.",
                name: "David R.",
                role: "Managing Partner, Linear Labs",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="card space-y-4 border-border-subtle bg-white/[0.01]"
              >
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────── PRICING ─────────────────── */}
        <div className="mb-20">
          <h2 className="heading-md mb-3 text-center text-foreground">
            Simple Pricing
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            Start free. Upgrade when your agency grows.
          </p>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="card space-y-5 border-border-subtle">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Starter
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    Free
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  For solo devs just getting started.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  5 briefs per month
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  AI parsing & clarification
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Scope of work generation
                </li>
              </ul>
              <a
                href="/signup"
                className="btn-secondary w-full text-sm text-center"
              >
                Get Started Free
              </a>
            </div>
            <div className="card space-y-5 border-indigo-500/30 bg-indigo-500/[0.03] relative">
              <div className="absolute -top-3 right-4 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-medium text-white">
                Popular
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Pro</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    $49
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  For growing dev agencies.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Unlimited briefs
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Invoice generation
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Client portal & contract e-sign
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Team members (up to 5)
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0 text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
              <a
                href="/signup"
                className="btn-primary w-full text-sm text-center"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>

        {/* ─────────────────── CTA ─────────────────── */}
        <div className="mb-20 text-center" id="cta">
          <div className="card border-indigo-500/20 bg-indigo-500/[0.03] p-8 sm:p-12">
            <h2 className="heading-lg mb-4 text-foreground text-2xl font-bold sm:text-3xl">
              Ready to automate your client intake?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground leading-relaxed">
              Sign up in 60 seconds, get your unique intake link, and start
              receiving AI-analysed briefs today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/signup"
                className="btn-primary text-base px-8 inline-flex items-center gap-2"
              >
                Start Free
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
              </a>
              <a href="#how-it-works" className="btn-ghost text-sm">
                See How It Works ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
