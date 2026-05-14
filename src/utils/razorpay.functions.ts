import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createHmac } from "crypto";
import { z } from "zod";

const PLANS: Record<string, { credits: number; amount_paise: number; label: string }> = {
  starter: { credits: 10, amount_paise: 49900, label: "Starter" },
  growth: { credits: 50, amount_paise: 149900, label: "Growth" },
  scale: { credits: 200, amount_paise: 499900, label: "Scale" },
};

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ plan: z.enum(["starter", "growth", "scale"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const plan = PLANS[data.plan];

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys are not configured");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.amount_paise,
        currency: "INR",
        receipt: `r_${userId.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: userId, plan: data.plan },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Razorpay order create failed:", res.status, text);
      throw new Error(`Razorpay order create failed [${res.status}]`);
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };

    const { error } = await supabaseAdmin.from("payments").insert({
      user_id: userId,
      plan: data.plan,
      amount_paise: plan.amount_paise,
      currency: "INR",
      credits_granted: plan.credits,
      status: "created",
      razorpay_order_id: order.id,
    });
    if (error) {
      console.error("payments insert error:", error);
      throw new Error("Failed to record order");
    }

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      plan_label: plan.label,
      credits: plan.credits,
    };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      razorpay_order_id: z.string().min(1).max(64),
      razorpay_payment_id: z.string().min(1).max(64),
      razorpay_signature: z.string().min(1).max(256),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay keys are not configured");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== data.razorpay_signature) {
      console.error("Razorpay signature mismatch", { userId, order: data.razorpay_order_id });
      await supabaseAdmin
        .from("payments")
        .update({ status: "failed", razorpay_payment_id: data.razorpay_payment_id, updated_at: new Date().toISOString() })
        .eq("razorpay_order_id", data.razorpay_order_id)
        .eq("user_id", userId);
      return { success: false, error: "Signature verification failed" };
    }

    const { data: payment, error: fetchErr } = await supabaseAdmin
      .from("payments")
      .select("id, status, credits_granted, user_id")
      .eq("razorpay_order_id", data.razorpay_order_id)
      .maybeSingle();

    if (fetchErr || !payment) {
      console.error("payments fetch error:", fetchErr);
      return { success: false, error: "Order not found" };
    }
    if (payment.user_id !== userId) {
      return { success: false, error: "Order does not belong to user" };
    }
    if (payment.status === "paid") {
      return { success: true, alreadyProcessed: true, credits: payment.credits_granted };
    }

    const { error: updErr } = await supabaseAdmin
      .from("payments")
      .update({
        status: "paid",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id)
      .eq("status", "created");

    if (updErr) {
      console.error("payments update error:", updErr);
      return { success: false, error: "Failed to record payment" };
    }

    const { data: grant, error: grantErr } = await supabaseAdmin.rpc("grant_credits_atomic", {
      p_user_id: userId,
      p_credits: payment.credits_granted,
    });
    if (grantErr) {
      console.error("grant_credits_atomic error:", grantErr);
      return { success: false, error: "Payment captured but credits not granted. Contact support." };
    }

    const result = grant as { success: boolean; error?: string };
    if (!result.success) {
      return { success: false, error: result.error ?? "Failed to grant credits" };
    }

    return { success: true, credits: payment.credits_granted };
  });