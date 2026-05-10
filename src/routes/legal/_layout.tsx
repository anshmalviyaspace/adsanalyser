import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header, Footer } from "@/components/LandingPage";

export const Route = createFileRoute("/legal/_layout")({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}