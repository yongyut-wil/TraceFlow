import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "TraceFlow — Telemetry Terminal",
  description: "Ops-terminal real-time telemetry dashboard — 10k-point ring buffer, LTTB ECharts, hybrid Supabase/mock data layer",
  openGraph: {
    title: "TraceFlow — Telemetry Terminal",
    description: "Ops-terminal real-time telemetry dashboard",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} dark h-full antialiased`}
      // The CSS pipeline drops `color-scheme`; set it inline so native
      // controls (datetime picker, scrollbars) render dark chrome.
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-background">
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
