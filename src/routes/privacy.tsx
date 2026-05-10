import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/LegalShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AI Ad Doctor" },
      { name: "description", content: "How AI Ad Doctor collects, uses, and protects your personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="May 10, 2026">
      <p>
        AI Ad Doctor ("we", "our", "us"), operated by Webcom Media, is committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
        information when you use our platform at ai-ad-doctor.lovable.app (the "Service").
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email address, and authentication identifiers.</li>
        <li><strong>Uploaded content:</strong> Meta Ads dashboard screenshots you submit for analysis.</li>
        <li><strong>Usage data:</strong> pages visited, features used, device and browser metadata.</li>
        <li><strong>Payment data:</strong> processed securely by Razorpay; we do not store full card details.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide, operate, and maintain the Service.</li>
        <li>Generate AI-powered ad analysis and recommendations.</li>
        <li>Process payments and issue GST invoices.</li>
        <li>Communicate updates, support responses, and security notices.</li>
        <li>Detect, prevent, and address fraud or technical issues.</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>
        We do not sell your personal data. We share data only with trusted processors strictly to
        operate the Service: Supabase (database & auth), Vellum (AI inference), Razorpay (payments),
        and our hosting providers. All processors are bound by data-protection agreements.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We use 256-bit SSL encryption in transit, encryption at rest, role-based access control, and
        regular security audits. While no system is impenetrable, we apply industry-standard
        safeguards aligned with SOC 2 principles.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        Account data is retained while your account is active. Uploaded screenshots and analysis
        history are retained for 12 months unless you delete them sooner. You may request deletion
        of your data at any time by emailing support@webcommedia.com.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your jurisdiction (including GDPR for EU residents and the DPDP Act for India),
        you have rights to access, correct, export, or delete your personal data, and to withdraw
        consent. Contact us at support@webcommedia.com to exercise any of these rights.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use essential cookies for authentication and session management. We do not use
        third-party advertising cookies.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Policy from time to time. Material changes will be communicated via
        email or a prominent notice on the Service.
      </p>

      <h2>9. Contact</h2>
      <p>
        Webcom Media — Email: <a href="mailto:support@webcommedia.com">support@webcommedia.com</a>
      </p>
    </LegalShell>
  );
}