import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/LandingPage";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Crown, Building2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI Ad Doctor | Choose Your Plan" },
      { name: "description", content: "Affordable one-time plans to analyze your Meta Ads. Start free, upgrade for more AI-powered ad analysis." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    price: "₹499",
    period: "/one-time",
    subtitle: "10 ad analyses",
    features: [
      "10 ad analyses",
      "AI-powered recommendations",
      "Risk assessment",
      "Action plans",
      "Email support",
    ],
    cta: "Get Starter",
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "₹1,499",
    period: "/one-time",
    subtitle: "50 ad analyses",
    features: [
      "50 ad analyses",
      "Advanced AI models",
      "Custom performance targets",
      "Detailed action plans",
      "Priority support",
      "Export to PDF",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "₹4,999",
    period: "/one-time",
    subtitle: "Unlimited ad analyses",
    features: [
      "Unlimited analyses",
      "Premium AI models",
      "White-label reports",
      "API access",
      "Dedicated support",
      "Team collaboration",
      "Custom integrations",
    ],
    cta: "Get Enterprise",
    popular: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="px-6 pt-28 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Pricing
            </p>
            <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
              Choose Your{" "}
              <span className="text-gradient-primary">Growth Plan</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Start with 1 free analysis. Upgrade to unlock more AI-powered ad recommendations.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? "border-primary shadow-md"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <plan.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-foreground">
                  {plan.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.subtitle}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/login">
                <Button
                  variant={plan.popular ? "hero" : "hero-outline"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  {plan.cta}
                </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            All plans are one-time payments. No recurring charges. Secure
            payments via Razorpay.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
