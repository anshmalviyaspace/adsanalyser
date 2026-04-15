import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const FREE_LIMIT = 1;

export const checkCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("user_credits")
      .select("free_used, purchased_credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return { canAnalyze: false, remaining: 0, error: "Failed to check credits" };
    }

    if (!data) {
      // No record yet — user has 1 free analysis
      return { canAnalyze: true, remaining: FREE_LIMIT };
    }

    const totalAvailable = (FREE_LIMIT - data.free_used) + data.purchased_credits;
    return { canAnalyze: totalAvailable > 0, remaining: Math.max(0, totalAvailable) };
  });

export const consumeCredit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("user_credits")
      .select("free_used, purchased_credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return { success: false, error: "Failed to check credits" };
    }

    if (!data) {
      // First use — create record with free_used = 1
      const { error: insertErr } = await supabase
        .from("user_credits")
        .insert({ user_id: userId, free_used: 1, purchased_credits: 0 });
      if (insertErr) return { success: false, error: "Failed to consume credit" };
      return { success: true };
    }

    const freeRemaining = FREE_LIMIT - data.free_used;

    if (freeRemaining > 0) {
      const { error: updateErr } = await supabase
        .from("user_credits")
        .update({ free_used: data.free_used + 1, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (updateErr) return { success: false, error: "Failed to consume credit" };
      return { success: true };
    }

    if (data.purchased_credits > 0) {
      const { error: updateErr } = await supabase
        .from("user_credits")
        .update({ purchased_credits: data.purchased_credits - 1, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (updateErr) return { success: false, error: "Failed to consume credit" };
      return { success: true };
    }

    return { success: false, error: "No credits remaining" };
  });
