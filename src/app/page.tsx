import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'TraceFlow — Telemetry Terminal',
};

export default function Home() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Suspense fallback={<div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground">Loading Telemetry...</div>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
