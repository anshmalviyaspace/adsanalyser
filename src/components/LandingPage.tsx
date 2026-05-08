import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Upload, Zap, Target, Shield, ArrowRight, CheckCircle, LogOut, History, Menu, X, Lock, Award, BarChart3, Users } from "lucide-react";
import appLogo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useState, useSyncExternalStore } from "react";

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/92 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={appLogo} alt="AI Ad Doctor" className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-foreground">AI Ad Doctor</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="sm:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/pricing">
            <Button variant="ghost" size="sm">Pricing</Button>
          </Link>
          {showAuthUI && user && (
            <>
              <Link to="/history">
                <Button variant="ghost" size="sm">
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          )}
          {showAuthUI && !user && (
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
          <Link to="/analyze">
            <Button variant="hero" size="default">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border/40 bg-background/98 backdrop-blur-xl px-4 py-4 space-y-2">
          <Link to="/pricing" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">Pricing</Button>
          </Link>
          {showAuthUI && user && (
            <>
              <Link to="/history" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { signOut(); setMenuOpen(false); }}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          )}
          {showAuthUI && !user && (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Sign In</Button>
            </Link>
          )}
          <Link to="/analyze" onClick={() => setMenuOpen(false)}>
            <Button variant="hero" size="default" className="w-full">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/4 blur-3xl animate-in fade-in zoom-in-75 duration-1000"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Shield className="h-3.5 w-3.5 text-primary" />
          Trusted by 500+ Advertisers Worldwide
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          Upload Your Ad Screenshot.{" "}
          <span className="text-gradient-primary">Get Exact Actions</span>{" "}
          in Seconds.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
          Enterprise-grade AI analysis for Meta Ads. No dashboards, no confusion — just clear, actionable decisions that improve your ROAS.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/analyze">
            <Button variant="hero" size="xl">
              Start Free Analysis
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="hero-outline" size="xl">
              View Plans
            </Button>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-primary" />
            SOC 2 Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" />
            256-bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-primary" />
            GDPR Ready
          </span>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { value: "5,000+", label: "Ads Analyzed" },
    { value: "2.8×", label: "Avg. ROAS Improvement" },
    { value: "< 30s", label: "Time to Insights" },
    { value: "95%", label: "Recommendation Accuracy" },
  ];

  return (
    <section className="border-y border-border/50 bg-card py-14 sm:py-18">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Intelligent Data Extraction",
      description: "Our proprietary AI engine reads and extracts every metric from your Meta Ads dashboard screenshot automatically.",
    },
    {
      icon: Target,
      title: "Performance Benchmarking",
      description: "AI identifies top and under-performing campaigns, benchmarking them against industry standards for your vertical.",
    },
    {
      icon: Award,
      title: "Actionable Recommendations",
      description: "Receive prioritized, confidence-scored action plans — not generic advice, but specific steps tailored to your account.",
    },
    {
      icon: Shield,
      title: "Risk & Compliance",
      description: "Every recommendation includes a risk assessment so your team can make informed budget decisions with confidence.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Platform Capabilities</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl tracking-tight">
            Enterprise-Grade Ad Intelligence
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground sm:text-lg leading-relaxed">
            Built for performance marketers and agencies who need reliable, fast, and defensible ad optimization decisions.
          </p>
        </div>
        <div className="mt-14 sm:mt-20 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/60 bg-card p-7 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { step: "01", title: "Upload Screenshot", description: "Capture your Meta Ads Manager dashboard and securely upload it to our platform." },
    { step: "02", title: "Configure Objectives", description: "Select your campaign goal and optional KPI targets for tailored analysis." },
    { step: "03", title: "Receive Action Plan", description: "Get a comprehensive, risk-assessed action plan with confidence-scored recommendations." },
  ];

  return (
    <section id="how-it-works" className="border-t border-border/50 bg-card py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl tracking-tight">
            Three Steps to Better Ads
          </h2>
        </div>
        <div className="mt-14 sm:mt-20 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-border/60 bg-background p-8 sm:p-10 transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="text-5xl font-bold text-primary/10">{step.step}</span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-10">
          Security & Compliance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Lock, title: "End-to-End Encryption", desc: "256-bit SSL on all data transfers" },
            { icon: Shield, title: "GDPR Compliant", desc: "Full data privacy compliance" },
            { icon: Users, title: "Trusted by 500+ Brands", desc: "Agencies & in-house teams" },
            { icon: Award, title: "99.9% Uptime SLA", desc: "Enterprise-grade infrastructure" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-10 text-center sm:p-14 md:p-18">
        <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl tracking-tight">
          Ready to Optimize Your Ads?
        </h2>
        <p className="mt-4 text-base text-primary-foreground/80 sm:text-lg leading-relaxed">
          Join hundreds of performance marketers who trust AI Ad Doctor for data-driven ad decisions.
        </p>
        <div className="mt-10">
          <Link to="/analyze" className="inline-block">
            <Button variant="hero-outline" size="xl" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              Start Your Free Analysis
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-xs text-primary-foreground/60">No credit card required · 1 free analysis included</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={appLogo} alt="AI Ad Doctor" className="h-7 w-7 object-contain" />
              <span className="text-base font-semibold text-foreground">AI Ad Doctor</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enterprise-grade AI analysis for Meta Ads. Helping performance marketers make better decisions, faster.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-3">Product</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/analyze" className="hover:text-foreground transition-colors">Analyze Ads</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">Company</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="https://webcommedia.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Webcom Media</a></li>
                <li><a href="mailto:support@webcommedia.com" className="hover:text-foreground transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">Legal</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="cursor-default">Privacy Policy</span></li>
                <li><span className="cursor-default">Terms of Service</span></li>
                <li><span className="cursor-default">Refund Policy</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 AI Ad Doctor by Webcom Media. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL Secured</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
