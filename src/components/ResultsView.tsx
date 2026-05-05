import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, BarChart3, Shield, Gauge } from "lucide-react";
import type { AnalysisResult } from "@/utils/analyze.functions";

interface ResultsViewProps {
  results: AnalysisResult;
  onReset: () => void;
}

const riskConfig = {
  low: { label: "Low Risk", color: "bg-success/10 text-success border-success/20" },
  medium: { label: "Medium Risk", color: "bg-warning/10 text-warning border-warning/20" },
  high: { label: "High Risk", color: "bg-danger/10 text-danger border-danger/20" },
};

const confidenceConfig = {
  High: { color: "text-success" },
  Medium: { color: "text-warning" },
  Low: { color: "text-danger" },
};

export function ResultsView({ results, onReset }: ResultsViewProps) {
  const risk = riskConfig[results.riskLevel];
  const dataConf = confidenceConfig[results.dataConfidence];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Analysis Complete</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          {results.campaignState}
        </h1>
      </div>

      {/* Best Performer */}
      <Card className="border-success/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-success">Best Performer</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{results.bestPerformer.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{results.bestPerformer.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worst Performer */}
      <Card className="border-danger/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10">
              <TrendingDown className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-danger">Worst Performer</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{results.worstPerformer.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{results.worstPerformer.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Decision</p>
              <p className="mt-1 text-xl font-bold text-foreground">{results.decision}</p>
              <p className="mt-2 text-sm text-muted-foreground">{results.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Action Plan</p>
          </div>
          <ol className="space-y-3">
            {results.actionPlan.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <Shield className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${risk.color}`}>
              {risk.label}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Gauge className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <p className="text-2xl font-bold text-primary">{results.confidenceScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <CheckCircle className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Data Quality</p>
            <p className={`text-lg font-bold ${dataConf.color}`}>{results.dataConfidence}</p>
          </CardContent>
        </Card>
      </div>

      <Button variant="hero" size="xl" className="w-full" onClick={onReset}>
        Analyze Another Screenshot
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
