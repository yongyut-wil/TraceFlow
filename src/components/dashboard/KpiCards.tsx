'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Activity, AlertTriangle } from 'lucide-react';
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
  const anomalyRate = stats.count > 0 ? (stats.anomalies.length / stats.count) * 100 : 0;
  const critCount = stats.anomalies.filter((a) => a.severity === 'CRIT').length;

  const cards = [
    {
      title: 'Current Value',
      icon: <ArrowDownRight className="h-3 w-3 text-emerald-500" />,
      value: isLoading ? '--' : fmt(stats.last),
      unit,
      sub: `live · ${stats.count.toLocaleString()} pts buffered`,
      subClass: 'text-emerald-500',
    },
    {
      title: 'Window Mean',
      icon: <Activity className="h-3 w-3 text-secondary" />,
      value: isLoading ? '--' : fmt(stats.count > 0 ? stats.avg : null),
      unit,
      sub: `mean over buffer window`,
      subClass: 'text-secondary',
    },
    {
      title: 'Peak',
      icon: <ArrowUpRight className="h-3 w-3 text-primary" />,
      value: isLoading ? '--' : fmt(stats.count > 0 ? stats.max : null),
      unit,
      sub: 'max in window',
      subClass: 'text-primary',
    },
    {
      title: 'Anomalies',
      icon: <AlertTriangle className="h-3 w-3 text-amber-500" />,
      value: isLoading ? '--' : stats.anomalies.length.toLocaleString(),
      unit: '',
      sub: `${anomalyRate.toFixed(2)}% of buffer · ${critCount} CRIT`,
      subClass: 'text-amber-500',
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-4 gap-3 p-3">
      {cards.map((c) => (
        <Card key={c.title} className="rounded-none border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
            <CardTitle className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {c.title}
            </CardTitle>
            {c.icon}
          </CardHeader>
          <CardContent className="p-3">
            <div className="font-mono text-2xl font-medium text-foreground">
              {c.value} <span className="text-sm text-muted-foreground">{c.unit}</span>
            </div>
            <div className={`mt-1 font-mono text-[10px] ${c.subClass}`}>{c.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
