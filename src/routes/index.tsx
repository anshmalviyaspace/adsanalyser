import { createFileRoute } from "@tanstack/react-router";
import {
  Header,
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  Footer,
} from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Ad Doctor — Upload Ads Screenshots, Get Exact Actions" },
      { name: "description", content: "Upload your Meta Ads screenshot and get instant, actionable recommendations. No dashboards, no confusion — just decisions." },
      { property: "og:title", content: "AI Ad Doctor — Get Exact Actions in Seconds" },
      { property: "og:description", content: "Upload your Meta Ads screenshot and get instant, actionable recommendations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
