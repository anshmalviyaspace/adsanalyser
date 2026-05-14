import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header, Footer } from "@/components/LandingPage";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSyncExternalStore, useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/utils/razorpay.functions";
import { toast } from "sonner";

type PlanKey = "starter" | "growth" | "scale";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI Ad Doctor" },
      { name: "description", content: "Simple, one-time credit packs for Meta Ads analysis. Start free, scale as needed." },
      { property: "og:title", content: "Pricing — AI Ad Doctor" },
      { property: "og:description", content: "Simple, one-time credit packs for Meta Ads analysis." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    key: "starter" as PlanKey,
    name: "Starter",
    price: "₹499",
    credits: 10,
    subtitle: "Best for trying out",
    features: [
      "10 ad analyses",
      "AI-powered recommendations",
      "Risk & confidence scoring",
      "Step-by-step action plans",
      "Email support",
    ],
    popular: false,
  },
  {
    key: "growth" as PlanKey,
    name: "Growth",
    price: "₹1,499",
    credits: 50,
    subtitle: "Most teams pick this",
    features: [
      "50 ad analyses",
      "Advanced model tier",
      "Custom KPI targets",
      "Priority email support",
      "Export to PDF",
      "Analysis history",
    ],
    popular: true,
  },
  {
    key: "scale" as PlanKey,
    name: "Scale",
    price: "₹4,999",
    credits: 200,
    subtitle: "For agencies & high-volume",
    features: [
      "200 ad analyses",
      "Premium model tier",
      "Branded PDF reports",
      "Dedicated account manager",
      "Onboarding session",
      "Priority queue",
    ],
    popular: false,
  },
];

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const createOrder = useServerFn(createRazorpayOrder);
  const verifyPayment = useServerFn(verifyRazorpayPayment);

  useEffect(() => {
    if (isClient) loadRazorpayScript();
  }, [isClient]);

  const handleCheckout = async (plan: PlanKey) => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setLoadingPlan(plan);
    try {
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        toast.error("Could not load payment SDK. Check your connection and retry.");
        return;
      }
      const order = await createOrder({ data: { plan } });

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "AI Ad Doctor",
        description: `${order.plan_label} — ${order.credits} credits`,
        prefill: {
          email: user.email ?? "",
        },
        theme: { color: "#4f46e5" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const result = await verifyPayment({ data: response });
            if (result.success) {
              toast.success(`Payment successful — ${order.credits} credits added.`);
              navigate({ to: "/analyze" });
            } else {
              toast.error(result.error ?? "Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Could not verify payment. Contact support if charged.");
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setLoadingPlan((p) => (p === plan ? null : p));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Pricing</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              Pay once. Use whenever.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              One-time credit packs. No subscriptions. No hidden fees. Start with one free analysis.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 transition-all ${
                  plan.popular
                    ? "border-primary/60 shadow-elevated"
                    : "border-border hover:border-border/80"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-7 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>
                </div>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  ₹{Math.round(parseInt(plan.price.replace(/[^\d]/g, "")) / plan.credits)} per analysis
                </p>

                <ul className="mt-7 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-success" strokeWidth={2} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  size="lg"
                  className="mt-8 w-full"
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout(plan.key)}
                >
                  {loadingPlan === plan.key ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      {user ? `Buy ${plan.name}` : `Choose ${plan.name}`}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Secure payments</p>
                <p className="mt-2 text-sm text-foreground">
                  Processed by Razorpay (PCI-DSS Level 1). Cards, UPI, netbanking, and wallets supported.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Refund policy</p>
                <p className="mt-2 text-sm text-foreground">
                  7-day money-back on unused credits. <Link to="/refund" className="text-primary hover:underline">Read policy →</Link>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Need invoice?</p>
                <p className="mt-2 text-sm text-foreground">
                  GST invoice provided on every purchase. Email <a href="mailto:support@webcommedia.com" className="text-primary hover:underline">support@webcommedia.com</a>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Secure payments via Razorpay</span>
            <span className="opacity-30">·</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> 7-day money-back guarantee</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
