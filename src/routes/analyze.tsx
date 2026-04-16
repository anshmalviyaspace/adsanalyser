import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header, Footer } from "@/components/LandingPage";
import { Upload, X, ArrowRight, Zap, Loader2, Lock } from "lucide-react";
import { ResultsView } from "@/components/ResultsView";
import { analyzeAds } from "@/utils/analyze.functions";
import { saveAnalysis } from "@/utils/saveAnalysis.functions";
import { checkCredits, consumeCredit } from "@/utils/credits.functions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult } from "@/utils/analyze.functions";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze Your Ads — AI Ad Doctor" },
      { name: "description", content: "Upload your Meta Ads screenshot and get AI-powered recommendations." },
      { property: "og:title", content: "Analyze Your Ads — AI Ad Doctor" },
      { property: "og:description", content: "Upload your Meta Ads screenshot and get AI-powered recommendations." },
    ],
  }),
  component: AnalyzePage,
});

type AppState = "input" | "processing" | "results";

function AnalyzePage() {
  const { user, session, loading } = useAuth();
  const [state, setState] = useState<AppState>("input");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [objective, setObjective] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  const [processingStep, setProcessingStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  // Check credits when user is authenticated
  useEffect(() => {
    if (!session?.access_token) return;
    setCreditsLoading(true);
    checkCredits({ headers: { Authorization: `Bearer ${session.access_token}` } })
      .then((res) => {
        setCreditsRemaining(res.remaining ?? 0);
      })
      .catch(() => setCreditsRemaining(0))
      .finally(() => setCreditsLoading(false));
  }, [session?.access_token]);

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

  const [error, setError] = useState<string | null>(null);

  const processingSteps = [
    "Reading your ad account...",
    "Extracting data...",
    "Analyzing performance...",
    "Generating action plan...",
  ];

  const startAnalysis = async () => {
    if (!image || !objective || !session?.access_token) return;

    // Consume a credit first
    try {
      const creditResult = await consumeCredit({ headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!creditResult.success) {
        setError(creditResult.error || "No credits remaining. Please upgrade your plan.");
        return;
      }
    } catch {
      setError("Failed to verify credits. Please try again.");
      return;
    }

    setState("processing");
    setProcessingStep(0);
    setError(null);

    // Convert image to base64 data URL
    const reader = new FileReader();
    const imageBase64: string = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });

    // Animate processing steps while API call runs
    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => Math.min(prev + 1, processingSteps.length - 1));
    }, 2000);

    try {
      const response = await analyzeAds({
        data: {
          imageBase64,
          objective: objective as "leads" | "purchases",
          targetValue: targetValue || undefined,
        },
      });

      clearInterval(stepInterval);

      if (response.error) {
        setError(response.error);
        setState("input");
        return;
      }

      setResults(response.result);
      setProcessingStep(processingSteps.length - 1);
      setState("results");
      // Update remaining credits
      if (creditsRemaining !== null) {
        setCreditsRemaining(Math.max(0, creditsRemaining - 1));
      }

      // Save to database if user is logged in
      if (session?.access_token && response.result) {
        try {
          await saveAnalysis({
            data: {
              objective: objective,
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
          });
        } catch (saveErr) {
          console.error("Failed to save analysis:", saveErr);
        }
      }
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
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        {/* Sign-in prompt (shown as overlay when user tries to analyze without auth) */}
        {!loading && !user && state === "signin-prompt" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">Sign In Required</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Sign in to get your free ad analysis. You get 1 free analysis to try it out.
            </p>
            <div className="mt-8 flex gap-3">
              <Button variant="hero-outline" size="xl" onClick={() => setState("input")}>
                Go Back
              </Button>
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Sign In to Analyze
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Credits exhausted */}
        {!loading && user && creditsRemaining === 0 && !creditsLoading && state === "input" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
              <Zap className="h-8 w-8 text-warning" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">No Credits Remaining</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              You've used your free analysis. Upgrade your plan to continue analyzing ads.
            </p>
            <Link to="/pricing" className="mt-8">
              <Button variant="hero" size="xl">
                View Plans
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

        {state === "input" && !(user && creditsRemaining === 0 && !creditsLoading) && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Analyze Your Ads</h1>
              <p className="mt-3 text-muted-foreground">Upload a screenshot and set your goals.</p>
              {creditsRemaining !== null && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {creditsRemaining} {creditsRemaining === 1 ? "analysis" : "analyses"} remaining
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Upload */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-foreground mb-3">Ad Screenshot</label>
                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-colors hover:border-primary/40 hover:bg-muted/50 cursor-pointer"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground/60" />
                    <p className="mt-4 text-sm font-medium text-foreground">
                      Drag & drop your screenshot here
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-muted/20" />
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Objective */}
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Campaign Objective</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select objective...</option>
                    <option value="leads">Leads</option>
                    <option value="purchases">Purchases</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Target CPA or ROAS <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="e.g. $25 CPA or 3x ROAS"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!image || !objective}
              onClick={startAnalysis}
            >
              Analyze
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {state === "processing" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-foreground">Analyzing Your Ads</h2>
            <div className="mt-8 w-full max-w-sm space-y-4">
              {processingSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-3 text-left">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all duration-500 ${
                      i < processingStep
                        ? "bg-success text-success-foreground"
                        : i === processingStep
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < processingStep ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      i <= processingStep ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === "results" && results && (
          <ResultsView results={results} onReset={reset} />
        )}
      </main>
      <Footer />
    </div>
  );
}
