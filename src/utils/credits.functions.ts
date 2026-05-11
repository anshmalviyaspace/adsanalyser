import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FREE_LIMIT = 1;

export const checkCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data, error } = await supabaseAdmin
      .from("user_credits")
      .select("free_used, purchased_credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("checkCredits error:", error);
      return { canAnalyze: false, remaining: 0, error: "Failed to check credits" };
    }

    if (!data) {
      return { canAnalyze: true, remaining: FREE_LIMIT };
    }

    const totalAvailable = (FREE_LIMIT - data.free_used) + data.purchased_credits;
    return { canAnalyze: totalAvailable > 0, remaining: Math.max(0, totalAvailable) };
  });

// Atomic consume — race-safe via SQL function. Returns { success, remaining?, error? }.
export const consumeCredit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data, error } = await supabaseAdmin.rpc("consume_credit_atomic", {
      p_user_id: userId,
    });

    if (error) {
      console.error("consumeCredit RPC error:", error);
      return { success: false, error: "Failed to consume credit" };
    }

    const result = data as { success: boolean; remaining?: number; error?: string };
    return result;
  });
