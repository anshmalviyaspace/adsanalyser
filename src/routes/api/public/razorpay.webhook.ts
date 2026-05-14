import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
          console.error("RAZORPAY_WEBHOOK_SECRET not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const signature = request.headers.get("x-razorpay-signature");
        const body = await request.text();
        if (!signature) {
          return new Response("Missing signature", { status: 401 });
        }

        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expected);
        if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
          console.warn("Razorpay webhook signature mismatch");
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const event: string | undefined = payload?.event;
        const paymentEntity = payload?.payload?.payment?.entity;
        const orderId: string | undefined =
          paymentEntity?.order_id ?? payload?.payload?.order?.entity?.id;
        const paymentId: string | undefined = paymentEntity?.id;

        if (!event || !orderId) {
          return new Response("ok", { status: 200 });
        }

        const { data: payment, error: fetchErr } = await supabaseAdmin
          .from("payments")
          .select("id, user_id, status, credits_granted, razorpay_payment_id")
          .eq("razorpay_order_id", orderId)
          .maybeSingle();

        if (fetchErr) {
          console.error("Webhook payments fetch error:", fetchErr);
          return new Response("DB error", { status: 500 });
        }
        if (!payment) {
          // Unknown order — ack to prevent retries; nothing to reconcile.
          console.warn("Razorpay webhook for unknown order:", orderId);
          return new Response("ok", { status: 200 });
        }

        if (event === "payment.failed") {
          if (payment.status === "created") {
            await supabaseAdmin
              .from("payments")
              .update({
                status: "failed",
                razorpay_payment_id: paymentId ?? payment.razorpay_payment_id,
                updated_at: new Date().toISOString(),
              })
              .eq("id", payment.id);
          }
          return new Response("ok", { status: 200 });
        }

        const isSuccess =
          event === "payment.captured" ||
          event === "payment.authorized" ||
          event === "order.paid";

        if (!isSuccess) {
          return new Response("ok", { status: 200 });
        }

        if (payment.status === "paid") {
          return new Response("ok", { status: 200 });
        }

        // Atomic transition created -> paid; only one writer wins.
        const { data: updated, error: updErr } = await supabaseAdmin
          .from("payments")
          .update({
            status: "paid",
            razorpay_payment_id: paymentId ?? payment.razorpay_payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.id)
          .eq("status", "created")
          .select("id");

        if (updErr) {
          console.error("Webhook payments update error:", updErr);
          return new Response("DB error", { status: 500 });
        }

        if (!updated || updated.length === 0) {
          // Already reconciled by client verify or another webhook.
          return new Response("ok", { status: 200 });
        }

        const { error: grantErr } = await supabaseAdmin.rpc("grant_credits_atomic", {
          p_user_id: payment.user_id,
          p_credits: payment.credits_granted,
        });
        if (grantErr) {
          console.error("Webhook grant_credits_atomic error:", grantErr);
          // Return 500 so Razorpay retries; payment row is already 'paid'
          // but credits not granted — retry will be a no-op on payments
          // (status already paid) and we re-enter only if status was 'created'.
          // To allow retry of grant, revert status back to 'created':
          await supabaseAdmin
            .from("payments")
            .update({ status: "created", updated_at: new Date().toISOString() })
            .eq("id", payment.id);
          return new Response("Grant failed", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});