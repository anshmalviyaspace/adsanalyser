import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/LandingPage";
import { Upload, X, ArrowRight, Zap, Loader2, Lock, Sparkles } from "lucide-react";
import { ResultsView } from "@/components/ResultsView";
import { analyzeAds } from "@/utils/analyze.functions";
import { saveAnalysis } from "@/utils/saveAnalysis.functions";
import { checkCredits, consumeCredit } from "@/utils/credits.functions";
import { useAuth } from "@/hooks/useAuth";
import type { AnalysisResult } from "@/utils/analyze.functions";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your ads — AI Ad Doctor" },
      { name: "description", content: "Upload your Meta Ads screenshot and get AI-powered recommendations." },
    ],
  }),
  component: AnalyzePage,
});

type AppState = "input" | "processing" | "results" | "signin-prompt";

function AnalyzePage() {
  const { user, session, loading } = useAuth();
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  const [state, setState] = useState<AppState>("input");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [objective, setObjective] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  const [processingStep, setProcessingStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = useCallback(async () => {
    if (!session?.access_token) return;
    setCreditsLoading(true);
    try {
      const res = await checkCredits({ headers: { Authorization: `Bearer ${session.access_token}` } });
      setCreditsRemaining(res.remaining ?? 0);
    } catch {
      setCreditsRemaining(0);
    } finally {
      setCreditsLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => { void refreshCredits(); }, [refreshCredits]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const processingSteps = [
    "Reading your ad account...",
    "Extracting data...",
    "Analyzing performance...",
    "Generating action plan...",
  ];

  const startAnalysis = async () => {
    if (!image || !objective) return;
    if (!user || !session?.access_token) {
      setState("signin-prompt");
      return;
    }

    setState("processing");
    setProcessingStep(0);
    setError(null);

    const reader = new FileReader();
    const imageBase64: string = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });

    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => Math.min(prev + 1, processingSteps.length - 1));
    }, 2000);

    try {
      // Run analysis FIRST
      const response = await analyzeAds({
        data: { imageBase64, objective: objective as "leads" | "purchases", targetValue: targetValue || undefined },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      clearInterval(stepInterval);

      if (response.error || !response.result) {
        setError(response.error || "Analysis failed. Please try again.");
        setState("input");
        return;
      }

      // Only consume credit AFTER successful analysis (atomic SQL function)
      const creditResult = await consumeCredit({ headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!creditResult.success) {
        setError(creditResult.error || "No credits remaining. Please upgrade your plan.");
        setState("input");
        await refreshCredits();
        return;
      }

      setResults(response.result);
      setProcessingStep(processingSteps.length - 1);
      setState("results");
      setCreditsRemaining(creditResult.remaining ?? Math.max(0, (creditsRemaining ?? 1) - 1));

      // Save in background
      void saveAnalysis({
        data: {
          objective,
          targetValue: targetValue || undefined,
          campaignState: response.result.campaignState,
          bestPerformer: response.result.bestPerformer,
          worstPerformer: response.result.worstPerformer,
          decision: response.result.decision,
          reason: response.result.reason,
          actionPlan: response.result.actionPlan,
          riskLevel: response.result.riskLevel,
          confidenceScore: response.result.confidenceScore,
          dataConfidence: response.result.dataConfidence,
        },
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch((err) => console.error("Failed to save analysis:", err));
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "Analysis failed. Please try again.");
      setState("input");
    }
  };

  const reset = () => {
    setState("input");
    setImage(null);
    setImagePreview(null);
    setObjective("");
    setTargetValue("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
        {isClient && !loading && !user && state === "signin-prompt" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">Sign in required</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create a free account to run your first analysis. No card required.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setState("input")}>Go back</Button>
              <Link to="/login">
                <Button variant="hero" size="lg">
                  Sign in to continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {isClient && !loading && user && creditsRemaining === 0 && !creditsLoading && state === "input" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">No credits remaining</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              You've used your free analysis. Upgrade for more.
            </p>
            <Link to="/pricing" className="mt-6">
              <Button variant="hero" size="lg">
                View plans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {state === "input" && !(user && creditsRemaining === 0 && !creditsLoading) && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Analyze</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">New analysis</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a screenshot, set your goal, get the action plan.
              </p>
              {creditsRemaining !== null && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {creditsRemaining} {creditsRemaining === 1 ? "credit" : "credits"} remaining
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>
            )}

            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
                Step 1 · Screenshot
              </label>
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface p-10 text-center transition-colors hover:border-primary/50 hover:bg-accent/40 cursor-pointer"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.5} />
                  <p className="mt-3 text-sm font-medium text-foreground">Drop your screenshot here</p>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-border bg-surface">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-contain" />
                  <button
                    onClick={removeImage}
                    className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-md bg-foreground/85 text-background hover:bg-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Step 2 · Objective
              </label>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Campaign objective</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
                >
                  <option value="">Select objective…</option>
                  <option value="leads">Leads</option>
                  <option value="purchases">Purchases</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Target CPA or ROAS <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g. ₹250 CPA or 3× ROAS"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
                />
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full" disabled={!image || !objective} onClick={startAnalysis}>
              Run analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              1 credit per analysis · Credit deducted only on success
            </p>
          </div>
        )}

        {state === "processing" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">Analyzing your ads</h2>
            <div className="mt-8 w-full max-w-sm space-y-3">
              {processingSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-3 text-left">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-500 ${
                      i < processingStep
                        ? "bg-success text-success-foreground"
                        : i === processingStep
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {i < processingStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm transition-colors ${i <= processingStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === "results" && results && <ResultsView results={results} onReset={reset} />}
      </main>
      <Footer />
    </div>
  );
}
