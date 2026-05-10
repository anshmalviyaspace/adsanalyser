import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/LegalShell";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — AI Ad Doctor" },
      { name: "description", content: "Our refund and cancellation policy for credit pack purchases." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalShell title="Refund & Cancellation Policy" updated="May 10, 2026">
      <p>
        We want you to be fully satisfied with AI Ad Doctor. This policy explains when and how
        refunds are processed for credit pack purchases.
      </p>

      <h2>1. 7-Day Money-Back Guarantee</h2>
      <p>
        If you are not satisfied with the Service, you may request a full refund within 7 days of
        your purchase, provided you have used fewer than 3 analyses from the credit pack.
      </p>

      <h2>2. Eligibility</h2>
      <ul>
        <li>Refund request must be made within 7 days of payment.</li>
        <li>Fewer than 3 analyses must have been consumed from the purchased pack.</li>
        <li>Account must not be in violation of the Terms of Service.</li>
      </ul>

      <h2>3. Non-Refundable Items</h2>
      <ul>
        <li>Credit packs that are fully or substantially consumed.</li>
        <li>Refund requests made after the 7-day window.</li>
        <li>Charges incurred due to user error (e.g., uploading wrong screenshots).</li>
      </ul>

      <h2>4. How to Request a Refund</h2>
      <p>
        Email <a href="mailto:support@webcommedia.com">support@webcommedia.com</a> from your
        registered email address with the subject line "Refund Request" and include your order ID.
      </p>

      <h2>5. Processing Time</h2>
      <p>
        Approved refunds are processed within 5–7 business days via the original payment method
        through Razorpay. Banks may take an additional 3–5 days to reflect the credit.
      </p>

      <h2>6. Cancellation</h2>
      <p>
        Since we offer one-time credit packs (no subscriptions), there is nothing to cancel. You
        can simply stop using the Service at any time.
      </p>

      <h2>7. Contact</h2>
      <p>
        Webcom Media — Email: <a href="mailto:support@webcommedia.com">support@webcommedia.com</a>
      </p>
    </LegalShell>
  );
}