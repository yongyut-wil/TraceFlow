'use client';

import { useEffect, useState } from 'react';
import type { ConnectionStatus } from '@/lib/data/contracts';

interface StatusBarProps {
  siteId: string;
  status: ConnectionStatus;
  points: number;
}

// Terminal status line — the authored detail that keeps the shell feeling
// like an ops console rather than a card layout. UTC clock ticks per second.
export function StatusBar({ siteId, status, points }: StatusBarProps) {
  const [clock, setClock] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-card px-3 font-mono text-micro text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="text-primary">TRACEFLOW</span>
        <span>TERM·01</span>
        <span className="hidden sm:inline">{siteId.toUpperCase().replaceAll('-', '_')}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">{points.toLocaleString()} PTS BUFFERED</span>
        <span className="uppercase">{status}</span>
        <span aria-hidden className="animate-pulse text-primary motion-reduce:animate-none">▮</span>
        <span>{clock} UTC</span>
      </div>
    </footer>
  );
}
