import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header, Footer } from "@/components/LandingPage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Clock, Trash2, Loader2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analysis History — AI Ad Doctor" },
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
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    async function fetchAnalyses() {
      const { data } = await supabase
        .from("analyses")
        .select("id, objective, campaign_state, decision, risk_level, confidence_score, created_at")
        .order("created_at", { ascending: false });
      setAnalyses(data || []);
      setLoading(false);
    }
    fetchAnalyses();
  }, [user]);

  const deleteAnalysis = async (id: string) => {
    await supabase.from("analyses").delete().eq("id", id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const riskColors: Record<string, string> = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-danger/10 text-danger",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
            <p className="mt-1 text-muted-foreground text-sm">{analyses.length} analyses</p>
          </div>
          <Link to="/analyze">
            <Button variant="hero">
              New Analysis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {analyses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground">No analyses yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Upload a screenshot to get started.</p>
              <Link to="/analyze" className="mt-4 inline-block">
                <Button variant="hero" size="default">Analyze My Ads</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => (
              <Card key={a.id} className="group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">{a.campaign_state}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{a.decision}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="capitalize">{a.objective}</span>
                        <span>•</span>
                        <span>{a.confidence_score}% confidence</span>
                        <span>•</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[a.risk_level] || ""}`}>
                          {a.risk_level} risk
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteAnalysis(a.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
