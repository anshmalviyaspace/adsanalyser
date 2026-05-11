import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  History,
  Lock,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import appLogo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useState, useSyncExternalStore } from "react";

/* ---------------- Header ---------------- */
export function Header() {
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const showAuthUI = isClient && !loading;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={appLogo} alt="AI Ad Doctor" className="h-7 w-7 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            AI Ad Doctor
          </span>
        </Link>

        <button
          className="sm:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden sm:flex items-center gap-1">
          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Button>
          </Link>
          {showAuthUI && user && (
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <History className="h-4 w-4 mr-1.5" />
                History
              </Button>
            </Link>
          )}
          <div className="ml-2 flex items-center gap-2">
            {showAuthUI && user ? (
              <>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Sign Out
                </Button>
                <Link to="/analyze">
                  <Button variant="hero" size="sm">
                    Open App
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : showAuthUI ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/analyze">
                  <Button variant="hero" size="sm">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-border/60 bg-background px-4 py-4 space-y-1.5">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </Button>
          {showAuthUI && user && (
            <>
              <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                <Link to="/history" onClick={() => setMenuOpen(false)}>
                  <History className="h-4 w-4 mr-2" />
                  History
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { signOut(); setMenuOpen(false); }}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
          {showAuthUI && !user && (
            <Button asChild variant="ghost" size="sm" className="w-full justify-start">
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
            </Button>
          )}
          <Button asChild variant="hero" size="sm" className="w-full">
            <Link to={user ? "/analyze" : "/analyze"} onClick={() => setMenuOpen(false)}>
              {user ? "Open App" : "Get Started"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[480px] bg-grid opacity-[0.5] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
            Trusted by 500+ performance teams
          </div>

          <h1 className="mt-6 text-[34px] sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
            Ad decisions,<br className="hidden sm:block" />
            <span className="text-gradient-primary">delivered in seconds.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Drop a Meta Ads screenshot. Get a ranked, risk-scored action plan.
            No dashboards. No noise. Just the next move.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/analyze">
              <Button variant="hero" size="lg" className="px-6">
                Start free analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" size="lg" className="px-5 text-foreground hover:bg-accent">
                See pricing
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> SOC 2 ready
            </span>
            <span className="opacity-30">·</span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> 256-bit SSL
            </span>
            <span className="opacity-30">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" /> GDPR compliant
            </span>
          </div>
        </div>

        {/* Mock product card */}
        <div className="relative mt-16 sm:mt-20 mx-auto max-w-4xl">
          <div className="rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 bg-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-3 text-[11px] font-medium text-muted-foreground">ai-ad-doctor.app/analyze</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {[
                { label: "Decision", value: "Pause Ad Set 4", tone: "danger" },
                { label: "Confidence", value: "92%", tone: "success" },
                { label: "Est. ROAS lift", value: "+1.4×", tone: "primary" },
              ].map((c) => (
                <div key={c.label} className="bg-card p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{c.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-5 space-y-2.5">
              {[
                "Reallocate ₹12k/day from Ad Set 4 → Ad Set 2",
                "Duplicate top creative with new hook variation",
                "Lower bid cap on declining audience by 15%",
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">{i + 1}</span>
                  <span className="text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
export function StatsSection() {
  const stats = [
    { value: "5,000+", label: "Ads analyzed" },
    { value: "2.8×", label: "Avg. ROAS lift" },
    { value: "<30s", label: "Time to insights" },
    { value: "95%", label: "Recommendation accuracy" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Intelligent extraction",
      description: "Reads every metric from your Meta Ads dashboard screenshot, with no manual data entry required.",
    },
    {
      icon: Target,
      title: "Performance benchmarking",
      description: "Pinpoints over- and under-performers and grades them against vertical-specific baselines.",
    },
    {
      icon: Sparkles,
      title: "Specific recommendations",
      description: "Confidence-scored next steps tied to your spend, audience, and creative — never generic advice.",
    },
    {
      icon: Shield,
      title: "Risk-aware guidance",
      description: "Every action includes a risk grade so your team can spend confidently and defend the call.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Platform</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Built for marketers who decide, not dashboard.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every output is engineered for action — clear, defensible, and tailored to the account in front of you.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden ring-soft">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card p-7 transition-colors hover:bg-surface"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/8 text-primary">
                <f.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-foreground tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
export function HowItWorksSection() {
  const steps = [
    { step: "01", title: "Upload screenshot", description: "Drop your Meta Ads Manager screenshot — secure, encrypted in transit." },
    { step: "02", title: "Set objective", description: "Pick the campaign goal and target KPI for tailored, contextual analysis." },
    { step: "03", title: "Get the action plan", description: "Receive a ranked, confidence-scored plan with a clear risk grade." },
  ];

  return (
    <section className="border-t border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workflow</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Three steps. Zero dashboards.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="rounded-xl border border-border bg-card p-7">
              <span className="text-xs font-mono font-semibold text-primary">{s.step}</span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust ---------------- */
export function TrustSection() {
  const items = [
    { icon: Lock, title: "End-to-end encryption", desc: "256-bit SSL across the platform" },
    { icon: Shield, title: "GDPR compliant", desc: "Full data privacy compliance" },
    { icon: Users, title: "Trusted by 500+ teams", desc: "Agencies and in-house performance" },
    { icon: Award, title: "99.9% uptime SLA", desc: "Enterprise-grade infrastructure" },
  ];
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Security & Compliance
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((it) => (
            <div key={it.title} className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground">
                <it.icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">{it.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
export function CTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card overflow-hidden ring-soft">
        <div className="relative px-8 py-14 sm:px-14 sm:py-16 text-center">
          <div className="absolute inset-0 bg-radial-fade opacity-60" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Ready to optimize your ads?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              One free analysis. No card. No setup. Just upload and decide.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/analyze">
                <Button variant="hero" size="lg" className="px-6">
                  Start free analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No credit card required · 1 free analysis included
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={appLogo} alt="AI Ad Doctor" className="h-7 w-7 object-contain" />
              <span className="text-[15px] font-semibold text-foreground">AI Ad Doctor</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered Meta Ads analysis for performance marketers and agencies.
              Decisions over dashboards.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-3">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/analyze" className="hover:text-foreground transition-colors">Analyze ads</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/history" className="hover:text-foreground transition-colors">History</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-3">Company & Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:support@webcommedia.com" className="hover:text-foreground transition-colors">Contact support</a></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link to="/refund" className="hover:text-foreground transition-colors">Refund policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 AI Ad Doctor, a product of Webcom Media. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> SSL Secured</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> GDPR</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Razorpay (PCI-DSS L1)</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground/80 leading-relaxed">
          Registered Office: Webcom Media, Mumbai, Maharashtra, India · GSTIN available on invoice · Payments processed securely by Razorpay.
        </p>
      </div>
    </footer>
  );
}
