import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const saveSchema = z.object({
  objective: z.string().min(1).max(100),
  targetValue: z.string().max(100).optional(),
  campaignState: z.string().min(1).max(500),
  bestPerformer: z.object({ name: z.string(), reason: z.string() }),
  worstPerformer: z.object({ name: z.string(), reason: z.string() }),
  decision: z.string().min(1).max(1000),
  reason: z.string().min(1).max(1000),
  actionPlan: z.array(z.string().max(500)).max(20),
  riskLevel: z.enum(["low", "medium", "high"]),
  confidenceScore: z.number().int().min(0).max(100),
  dataConfidence: z.enum(["High", "Medium", "Low"]),
});

export const saveAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.infer<typeof saveSchema>) => saveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase.from("analyses").insert({
      user_id: userId,
      objective: data.objective,
      target_value: data.targetValue || null,
      campaign_state: data.campaignState,
      best_performer: data.bestPerformer,
      worst_performer: data.worstPerformer,
      decision: data.decision,
      reason: data.reason,
      action_plan: data.actionPlan,
      risk_level: data.riskLevel,
      confidence_score: data.confidenceScore,
      data_confidence: data.dataConfidence,
    });

    if (error) {
      console.error("Failed to save analysis:", error);
      return { saved: false, error: "Failed to save analysis. Please try again." };
    }

    return { saved: true, error: null };
  });
