import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/LandingPage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Clock, Trash2, Loader2, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — AI Ad Doctor" },
      { name: "description", content: "View your past Meta Ads analyses." },
    ],
  }),
  component: HistoryPage,
});

interface AnalysisRow {
  id: string;
  objective: string;
  campaign_state: string;
  decision: string;
  risk_level: string;
  confidence_score: number;
  created_at: string;
}

function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("analyses")
        .select("id, objective, campaign_state, decision, risk_level, confidence_score, created_at")
        .order("created_at", { ascending: false });
      setAnalyses(data || []);
      setLoading(false);
    })();
  }, [user]);

  const deleteAnalysis = async (id: string) => {
    await supabase.from("analyses").delete().eq("id", id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const riskStyles: Record<string, string> = {
    low: "border-success/30 bg-success/5 text-success",
    medium: "border-warning/30 bg-warning/5 text-warning",
    high: "border-danger/30 bg-danger/5 text-danger",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">History</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Past analyses</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {analyses.length} {analyses.length === 1 ? "analysis" : "analyses"}
            </p>
          </div>
          <Link to="/analyze">
            <Button variant="hero" size="default">
              New analysis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {analyses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <FileBarChart className="mx-auto h-8 w-8 text-muted-foreground/50" strokeWidth={1.5} />
            <p className="mt-4 text-base font-medium text-foreground">No analyses yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Upload a screenshot to get started.</p>
            <Link to="/analyze" className="mt-5 inline-block">
              <Button variant="hero" size="default">Run your first analysis</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <ul className="divide-y divide-border">
              {analyses.map((a) => (
                <li key={a.id} className="group p-5 hover:bg-surface transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{a.campaign_state}</p>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${riskStyles[a.risk_level] || ""}`}>
                          {a.risk_level} risk
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">{a.decision}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="capitalize">{a.objective}</span>
                        <span className="opacity-30">·</span>
                        <span>{a.confidence_score}% confidence</span>
                        <span className="opacity-30">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(a.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAnalysis(a.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
