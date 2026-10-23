'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ZoomIn } from 'lucide-react';
import type { AnomalyEvent, ConnectionStatus } from '@/lib/data/contracts';

interface AnomalyStreamTableProps {
  anomalies: AnomalyEvent[];
  siteId: string;
  unit: string;
  status: ConnectionStatus;
  onInspect?: (timestampMs: number) => void;
}

function fmtTs(ts: number): string {
  return new Date(ts).toISOString().slice(11, 23);
}

function fmtDelta(deltaPct: number): string {
  return `${deltaPct >= 0 ? '+' : '−'}${Math.abs(deltaPct).toFixed(0)}%`;
}

export function AnomalyStreamTable({ anomalies, siteId, unit, status, onInspect }: AnomalyStreamTableProps) {
  const emptyMessage =
    status === 'disconnected'
      ? 'Source unavailable — check data mode'
      : 'No threshold breaches in buffer window';
  return (
    <div className="flex h-[250px] flex-col bg-card shrink-0">
      <div className="flex h-8 items-center justify-between border-b border-border bg-muted/30 px-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-0.5 bg-warn" />
          <span className="font-mono text-mini font-semibold uppercase tracking-[0.08em] text-foreground">Anomaly & Trace Inspector</span>
        </div>
        <div className="font-mono text-micro text-muted-foreground">LIVE FEED · {anomalies.length} EVENTS</div>
      </div>
      <ScrollArea className="flex-1 bg-background p-0">
        <table className="w-full text-left font-mono text-mini">
          <thead className="sticky top-0 bg-muted/50 text-muted-foreground">
            <tr>
              <th className="border-b border-border px-2 py-1.5 font-normal sm:px-3">TIMESTAMP (UTC)</th>
              <th className="border-b border-border px-2 py-1.5 font-normal sm:px-3">SEV</th>
              <th className="border-b border-border px-2 py-1.5 font-normal sm:px-3">NODE</th>
              <th className="border-b border-border px-2 py-1.5 font-normal sm:px-3">VALUE</th>
              <th className="border-b border-border px-2 py-1.5 font-normal sm:px-3">DELTA</th>
              <th className="border-b border-border px-2 py-1.5 font-normal text-right sm:px-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.length === 0 ? (
              <tr className="border-b border-border/50">
                <td colSpan={6} className="px-3 py-6 text-center font-mono text-mini uppercase tracking-[0.08em] text-dim">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              anomalies.map((row) => (
                <tr key={`${row.timestampMs}-${row.severity}`} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-2 py-2 text-foreground sm:px-3">{fmtTs(row.timestampMs)}</td>
                  <td className="px-2 py-2 sm:px-3">
                    <Badge
                      variant="outline"
                      className={`h-4 rounded-none border-none px-1 text-micro ${
                        row.severity === 'CRIT' ? 'bg-crit/20 text-crit' : 'bg-warn/20 text-warn'
                      }`}
                    >
                      {row.severity}
                    </Badge>
                  </td>
                  <td className="px-2 py-2 text-muted-foreground sm:px-3">{siteId.toUpperCase().replaceAll('-', '_')}</td>
                  <td className="px-2 py-2 text-foreground sm:px-3">{row.value.toFixed(1)} {unit}</td>
                  <td className="px-2 py-2 text-crit sm:px-3">{fmtDelta(row.deltaPct)}</td>
                  <td className="px-2 py-2 text-right sm:px-3">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onInspect?.(row.timestampMs)}
                            className="h-6 w-6 rounded-none text-muted-foreground hover:text-primary"
                          />
                        }
                      >
                        <ZoomIn className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent className="rounded-none border-border bg-popover font-mono text-mini text-foreground">
                        Zoom primary chart to this event
                      </TooltipContent>
                    </Tooltip>
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
