'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, TrendingUp, Sigma, AlertTriangle } from 'lucide-react';
import type { BufferStats } from '@/lib/data/contracts';

interface KpiCardsProps {
  stats: BufferStats;
  unit: string;
  isLoading: boolean;
}

function fmt(value: number | null, digits = 1): string {
  return value === null ? '--' : value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function KpiCards({ stats, unit, isLoading }: KpiCardsProps) {
  const critCount = stats.anomalies.filter((a) => a.severity === 'CRIT').length;

  const cards = [
    {
      title: 'Current Value',
      valueClass: 'text-live',
      icon: <Zap aria-hidden className="h-3 w-3 text-live" />,
      value: isLoading ? '--' : fmt(stats.last),
      unit,
      sub: `live · ${stats.count.toLocaleString()} pts buffered`,
      subClass: 'text-live',
    },
    {
      title: 'Window Mean',
      valueClass: 'text-secondary',
      icon: <Sigma aria-hidden className="h-3 w-3 text-secondary" />,
      value: isLoading ? '--' : fmt(stats.count > 0 ? stats.avg : null),
      unit,
      sub: `mean over buffer window`,
      subClass: 'text-secondary',
    },
    {
      title: 'Peak',
      valueClass: 'text-primary',
      icon: <TrendingUp aria-hidden className="h-3 w-3 text-primary" />,
      value: isLoading ? '--' : fmt(stats.count > 0 ? stats.max : null),
      unit,
      sub: 'max in window',
      subClass: 'text-primary',
    },
    {
      title: 'Anomalies',
      valueClass: 'text-warn',
      icon: <AlertTriangle aria-hidden className="h-3 w-3 text-warn" />,
      value: isLoading ? '--' : stats.anomalies.length.toLocaleString(),
      unit: '',
      sub: `${critCount} CRIT · newest ≤50 retained`,
      subClass: 'text-warn',
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 p-2 md:grid-cols-4 md:gap-3 md:p-3">
      {cards.map((c) => (
        <Card key={c.title} className="rounded-none border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
            <CardTitle className="font-mono text-mini font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {c.title}
            </CardTitle>
            {c.icon}
          </CardHeader>
          <CardContent className="p-3">
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-none bg-accent" />
            ) : (
              <div className={`font-mono text-value leading-8 font-medium tracking-tight ${c.value === '--' ? 'text-dim' : c.valueClass}`}>
                {c.value} <span className="text-xs text-muted-foreground">{c.unit}</span>
              </div>
            )}
            <div className={`mt-1 font-mono text-mini ${c.subClass}`}>{c.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
