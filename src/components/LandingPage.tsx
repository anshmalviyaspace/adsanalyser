import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Upload, Zap, Target, Shield, ArrowRight, CheckCircle, LogOut, History, Menu, X } from "lucide-react";
import appLogo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function Header() {
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={appLogo} alt="AI Ad Doctor" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold text-foreground">AI Ad Doctor</span>
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
          {!loading && user && (
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
          {!loading && !user && (
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
        <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-2">
          <Link to="/pricing" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">Pricing</Button>
          </Link>
          {!loading && user && (
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
          {!loading && !user && (
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
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 sm:px-6 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl animate-in fade-in zoom-in-75 duration-1000"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Zap className="h-3.5 w-3.5 text-primary" />
          AI-Powered Ad Analysis
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl">
          Upload Your Ads Screenshot.{" "}
          <span className="text-gradient-primary">Get Exact Actions</span>{" "}
          in Seconds.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
          No dashboards. No confusion. Just decisions.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/analyze">
            <Button variant="hero" size="xl">
              Analyze My Ads
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="hero-outline" size="xl">
              See How It Works
            </Button>
          </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-success" />
            Free to try
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-success" />
            AI-powered insights
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-success" />
            Actionable results
          </span>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { value: "5K+", label: "Ads Analyzed" },
    { value: "2.8x", label: "Avg. ROAS Lift" },
    { value: "< 30s", label: "Analysis Time" },
    { value: "95%", label: "Accuracy Rate" },
  ];

  return (
    <section className="border-y border-border bg-card py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Screenshot Upload",
      description: "Simply drag & drop your Meta Ads screenshot. Our AI reads and extracts all campaign data instantly.",
    },
    {
      icon: Target,
      title: "Smart Analysis",
      description: "AI identifies your best and worst performers, then recommends exact actions to improve results.",
    },
    {
      icon: Zap,
      title: "Instant Decisions",
      description: "Get clear, actionable recommendations with confidence scores — no more guessing.",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Color-coded risk levels help you understand the impact of each recommended action.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Everything You Need to Decide
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Turn ad screenshots into clear action plans in seconds.
          </p>
        </div>
        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
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
    { step: "01", title: "Upload Screenshot", description: "Take a screenshot of your Meta Ads dashboard and upload it." },
    { step: "02", title: "Set Your Goals", description: "Choose your campaign objective and optional performance targets." },
    { step: "03", title: "Get Your Plan", description: "Receive a detailed action plan with prioritized recommendations." },
  ];

  return (
    <section id="how-it-works" className="border-t border-border bg-card py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Simple Process</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Three Steps to Better Ads
          </h2>
        </div>
        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-border bg-background p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="text-5xl font-bold text-primary/10">{step.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-primary p-8 text-center sm:p-12 md:p-16">
        <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
          Ready to Optimize Your Ads?
        </h2>
        <p className="mt-4 text-base text-primary-foreground/80 sm:text-lg">
          Upload your first screenshot and get actionable insights in seconds.
        </p>
        <div className="mt-8">
          <Link to="/analyze" className="mt-8 inline-block">
            <Button variant="hero-outline" size="xl" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              Analyze My Ads Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-6 sm:py-8 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          <span>Powered by <a href="https://webcommedia.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">Webcom Media</a></span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 All rights reserved.</p>
      </div>
    </footer>
  );
}
