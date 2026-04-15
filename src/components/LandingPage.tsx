import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Upload, Zap, Target, Shield, ArrowRight, CheckCircle, LogOut, History } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

function useScrollRef() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

export function Header() {
  const { user, signOut, loading } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">AI Ad Doctor</span>
        </Link>
        <div className="flex items-center gap-3">
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
    </motion.header>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        />
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Zap className="h-3.5 w-3.5 text-primary" />
          AI-Powered Ad Analysis
        </motion.div>
        <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }} className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Upload Your Ads Screenshot.{" "}
          <span className="text-gradient-primary">Get Exact Actions</span>{" "}
          in Seconds.
        </motion.h1>
        <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          No dashboards. No confusion. Just decisions.
        </motion.p>
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
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
        </motion.div>
      </motion.div>
    </section>
  );
}

export function StatsSection() {
  const { ref, inView } = useScrollRef();
  const stats = [
    { value: "5K+", label: "Ads Analyzed" },
    { value: "2.8x", label: "Avg. ROAS Lift" },
    { value: "< 30s", label: "Analysis Time" },
    { value: "95%", label: "Accuracy Rate" },
  ];

  return (
    <section className="border-y border-border bg-card py-16">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={scaleIn} transition={{ duration: 0.5, type: "spring" }} className="text-center">
            <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function FeaturesSection() {
  const { ref, inView } = useScrollRef();
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
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeUp} transition={{ duration: 0.4 }} className="text-sm font-semibold uppercase tracking-wider text-primary">Features</motion.p>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Everything You Need to Decide
          </motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mt-4 text-lg text-muted-foreground">
            Turn ad screenshots into clear action plans in seconds.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/20 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const { ref, inView } = useScrollRef();
  const steps = [
    { step: "01", title: "Upload Screenshot", description: "Take a screenshot of your Meta Ads dashboard and upload it." },
    { step: "02", title: "Set Your Goals", description: "Choose your campaign objective and optional performance targets." },
    { step: "03", title: "Get Your Plan", description: "Receive a detailed action plan with prioritized recommendations." },
  ];

  return (
    <section id="how-it-works" className="border-t border-border bg-card py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeUp} transition={{ duration: 0.4 }} className="text-sm font-semibold uppercase tracking-wider text-primary">Simple Process</motion.p>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Three Steps to Better Ads
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } } }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative rounded-2xl border border-border bg-background p-8"
            >
              <span className="text-5xl font-bold text-primary/10">{step.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function CTASection() {
  const { ref, inView } = useScrollRef();

  return (
    <section className="py-24 px-6">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={scaleIn}
        transition={{ duration: 0.6, type: "spring" }}
        className="mx-auto max-w-3xl rounded-3xl bg-primary p-12 text-center sm:p-16"
      >
        <motion.h2 variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl font-bold text-primary-foreground sm:text-4xl">
          Ready to Optimize Your Ads?
        </motion.h2>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mt-4 text-lg text-primary-foreground/80">
          Upload your first screenshot and get actionable insights in seconds.
        </motion.p>
        <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <Link to="/analyze" className="mt-8 inline-block">
            <Button variant="hero-outline" size="xl" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              Analyze My Ads Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">AI Ad Doctor</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 AI Ad Doctor. All rights reserved.</p>
      </div>
    </footer>
  );
}
