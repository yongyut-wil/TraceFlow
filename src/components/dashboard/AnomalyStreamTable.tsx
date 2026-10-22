'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ZoomIn } from 'lucide-react';
import type { AnomalyEvent } from '@/lib/data/contracts';

interface AnomalyStreamTableProps {
  anomalies: AnomalyEvent[];
  siteId: string;
  unit: string;
}

function fmtTs(ts: number): string {
  return new Date(ts).toISOString().slice(11, 23);
}

export function AnomalyStreamTable({ anomalies, siteId, unit }: AnomalyStreamTableProps) {
  return (
    <div className="flex h-[250px] flex-col bg-card shrink-0">
      <div className="flex h-8 items-center justify-between border-b border-border bg-muted/30 px-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">Anomaly & Trace Inspector</span>
        </div>
        <div className="font-mono text-[9px] text-muted-foreground">LIVE FEED · {anomalies.length} EVENTS</div>
      </div>
      <ScrollArea className="flex-1 bg-background p-0">
        <table className="w-full text-left font-mono text-[10px]">
          <thead className="sticky top-0 bg-muted/50 text-muted-foreground">
            <tr>
              <th className="border-b border-border px-3 py-1.5 font-normal">TIMESTAMP (UTC)</th>
              <th className="border-b border-border px-3 py-1.5 font-normal">SEV</th>
              <th className="border-b border-border px-3 py-1.5 font-normal">NODE</th>
              <th className="border-b border-border px-3 py-1.5 font-normal">VALUE</th>
              <th className="border-b border-border px-3 py-1.5 font-normal">DELTA</th>
              <th className="border-b border-border px-3 py-1.5 font-normal text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.length === 0 ? (
              <tr className="border-b border-border/50">
                <td colSpan={6} className="px-3 py-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  No threshold breaches in buffer window
                </td>
              </tr>
            ) : (
              anomalies.map((row) => (
                <tr key={`${row.timestampMs}-${row.severity}`} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-3 py-2 text-foreground">{fmtTs(row.timestampMs)}</td>
                  <td className="px-3 py-2">
                    <Badge
                      variant="outline"
                      className={`h-4 rounded-none border-none px-1 text-[8px] ${
                        row.severity === 'CRIT' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                      }`}
                    >
                      {row.severity}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{siteId.toUpperCase().replaceAll('-', '_')}</td>
                  <td className="px-3 py-2 text-foreground">{row.value.toFixed(1)} {unit}</td>
                  <td className="px-3 py-2 text-rose-400">+{row.deltaPct.toFixed(0)}%</td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-none text-muted-foreground hover:text-primary">
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
