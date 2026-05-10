import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/LegalShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — AI Ad Doctor" },
      { name: "description", content: "The terms governing your use of AI Ad Doctor." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="May 10, 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of AI Ad Doctor (the
        "Service"), operated by Webcom Media. By creating an account or using the Service, you
        agree to be bound by these Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old and capable of entering into a binding contract.</p>

      <h2>2. Account Responsibility</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for
        all activities that occur under your account. Notify us immediately of any unauthorized use.
      </p>

      <h2>3. Acceptable Use</h2>
      <ul>
        <li>Do not upload content that infringes third-party rights or applicable law.</li>
        <li>Do not attempt to reverse-engineer, scrape, or disrupt the Service.</li>
        <li>Do not use the Service to generate or facilitate misleading or unlawful advertising.</li>
      </ul>

      <h2>4. Credits & Payments</h2>
      <p>
        The Service is offered on a one-time credit pack basis. All payments are processed through
        Razorpay in Indian Rupees (INR) and are inclusive of applicable GST. Credits are
        non-transferable.
      </p>

      <h2>5. AI-Generated Recommendations</h2>
      <p>
        Recommendations are generated using AI models and are provided for informational purposes
        only. You are solely responsible for any business decisions made based on the output. We do
        not guarantee specific advertising results, ROAS, or revenue outcomes.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Service, including software, design, and trademarks, is owned by Webcom Media. You
        retain all rights to the screenshots and content you upload. You grant us a limited license
        to process that content solely to provide the Service.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may suspend or terminate your access for violation of these Terms. You may stop using
        the Service at any time. Unused credits are subject to the Refund Policy.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Webcom Media shall not be liable for any indirect,
        incidental, or consequential damages arising from your use of the Service. Our total
        aggregate liability shall not exceed the amount you paid in the 12 months preceding the
        claim.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of the courts located in Mumbai, Maharashtra.
      </p>

      <h2>10. Contact</h2>
      <p>
        Webcom Media — Email: <a href="mailto:support@webcommedia.com">support@webcommedia.com</a>
      </p>
    </LegalShell>
  );
}