import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header, Footer } from "@/components/LandingPage";
import { Upload, X, ArrowRight, Zap, Loader2 } from "lucide-react";
import { ResultsView } from "@/components/ResultsView";
import { analyzeAds } from "@/utils/analyze.functions";
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

interface AnalysisResult {
  campaignState: string;
  bestPerformer: { name: string; reason: string };
  worstPerformer: { name: string; reason: string };
  decision: string;
  reason: string;
  actionPlan: string[];
  riskLevel: "low" | "medium" | "high";
  confidenceScore: number;
  dataConfidence: "High" | "Medium" | "Low";
}

function AnalyzePage() {
  const [state, setState] = useState<AppState>("input");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [objective, setObjective] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  const [processingStep, setProcessingStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);

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
    setState("processing");
    setProcessingStep(0);

    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    }

    // Mock results — replace with Vellum API call
    setResults({
      campaignState: "Scaling Phase",
      bestPerformer: {
        name: "Ad Set: Lookalike 1% — Video Creative A",
        reason: "Lowest CPA at $12.40 with consistent delivery and 3.2x ROAS over last 7 days.",
      },
      worstPerformer: {
        name: "Ad Set: Interest Stack — Static Image B",
        reason: "CPA spiked to $45.20 with declining CTR (0.6%) — learning phase stuck for 5 days.",
      },
      decision: "Kill the underperformer. Scale the winner by 20%.",
      reason: "The winning ad set has proven stability. The underperformer is draining budget with no signs of recovery.",
      actionPlan: [
        "Turn off 'Interest Stack — Static Image B' immediately",
        "Increase daily budget on 'Lookalike 1% — Video Creative A' by 20%",
        "Duplicate winning ad set with new 2% lookalike audience",
        "Monitor new ad set for 48 hours before further scaling",
        "Review results again in 3 days",
      ],
      riskLevel: "low",
      confidenceScore: 87,
      dataConfidence: "High",
    });
    setState("results");
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
        {state === "input" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Analyze Your Ads</h1>
              <p className="mt-3 text-muted-foreground">Upload a screenshot and set your goals.</p>
            </div>

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
