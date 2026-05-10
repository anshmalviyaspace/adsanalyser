import { ReactNode } from "react";
import { Header, Footer } from "@/components/LandingPage";

interface LegalShellProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalShell({ title, updated, children }: LegalShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <header className="mb-10 border-b border-border/60 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        </header>
        <article className="prose prose-slate max-w-none text-sm sm:text-base text-foreground leading-relaxed space-y-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}