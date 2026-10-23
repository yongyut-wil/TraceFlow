'use client';

import { useQueryStates } from 'nuqs';
import { dashboardSearchParams, TIME_RANGES, DATA_MODES, METRICS, COMPARE_OPTIONS } from '@/lib/search-params';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Pause, Play, Database, WifiOff } from 'lucide-react';
import type { ConnectionStatus, ResolvedSourceMode } from '@/lib/data/contracts';

interface HeaderFilterBarProps {
  status: ConnectionStatus;
  sourceMode: ResolvedSourceMode;
  isPaused: boolean;
  onTogglePause: () => void;
  bufferInfo: string;
}

const SOURCE_BADGE: Record<ResolvedSourceMode, { label: string; className: string }> = {
  supabase: {
    label: 'SUPABASE LIVE',
    className: 'border-live/50 bg-live/10 text-live',
  },
  mock: {
    label: 'MOCK STREAM',
    className: 'border-warn/50 bg-warn/10 text-warn',
  },
  error: {
    label: 'SOURCE ERROR',
    className: 'border-crit/50 bg-crit/10 text-crit',
  },
};

const CUSTOM_DEFAULT_MS = 3_600_000;

function toLocalInput(d: Date | null): string {
  if (!d) return '';
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function fromLocalInput(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function HeaderFilterBar({ status, sourceMode, isPaused, onTogglePause, bufferInfo }: HeaderFilterBarProps) {
  const [params, setParams] = useQueryStates(dashboardSearchParams);
  const { siteId, metric, compare, range, mode, from, to } = params;

  const badge = SOURCE_BADGE[sourceMode];

  const selectPresetRange = (r: Exclude<(typeof TIME_RANGES)[number], 'custom'>) =>
    setParams({ range: r, from: null, to: null });

  // range=custom is committed when the user actually picks a date — opening
  // the popover alone must not change the URL state.
  const setFrom = (v: string) => {
    const d = fromLocalInput(v);
    if (!d) return;
    setParams({ range: 'custom', from: d, to: to && to > d ? to : new Date(d.getTime() + CUSTOM_DEFAULT_MS) });
  };

  const setTo = (v: string) => {
    const d = fromLocalInput(v);
    if (!d) return;
    setParams({ range: 'custom', to: d, from: from && from < d ? from : new Date(d.getTime() - CUSTOM_DEFAULT_MS) });
  };

  const rangeBtnClass = (active: boolean) =>
    `px-2 py-0.5 font-mono text-mini uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
      active ? 'bg-accent text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

  const dateInputClass =
    'h-7 rounded-none border border-edge bg-background px-2 font-mono text-mini text-foreground';

  return (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border bg-card px-4 py-1 shrink-0">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-primary" />
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-primary">
            TraceFlow
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <Select value={siteId} onValueChange={(v) => v && setParams({ siteId: v })}>
          <SelectTrigger className="h-7 w-40 rounded-none border-edge bg-muted/50 font-mono text-xs">
            <SelectValue placeholder="Node" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-popover">
            <SelectItem value="node-us-east-01" className="font-mono text-xs">NODE_US_EAST_01</SelectItem>
            <SelectItem value="node-eu-west-02" className="font-mono text-xs">NODE_EU_WEST_02</SelectItem>
          </SelectContent>
        </Select>

        <Select value={metric} onValueChange={(v) => v && setParams({ metric: v })}>
          <SelectTrigger className="h-7 w-44 rounded-none border-edge bg-muted/50 font-mono text-xs">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-popover">
            {METRICS.map(m => (
              <SelectItem key={m.id} value={m.id} className="font-mono text-xs">{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={compare} onValueChange={(v) => v && setParams({ compare: v as typeof compare })}>
          <SelectTrigger className="h-7 w-40 rounded-none border-edge bg-muted/50 font-mono text-xs">
            <SelectValue placeholder="Compare" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-popover">
            {COMPARE_OPTIONS.map(m => (
              <SelectItem key={m} value={m} className="font-mono text-xs uppercase">{m === 'none' ? '— none' : m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex h-7 items-center rounded-none border border-edge bg-muted/50 p-0.5">
          {TIME_RANGES.map(r =>
            r === 'custom' ? (
              <Popover key={r}>
                <PopoverTrigger className={rangeBtnClass(range === 'custom')}>
                  {r}
                </PopoverTrigger>
                <PopoverContent className="w-64 rounded-none border-border bg-popover shadow-none">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-micro font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Custom Range (local time)
                    </span>
                    <label className="flex items-center justify-between gap-2 font-mono text-mini text-muted-foreground">
                      FROM
                      <input
                        type="datetime-local"
                        value={toLocalInput(from)}
                        onChange={(e) => setFrom(e.target.value)}
                        className={dateInputClass}
                      />
                    </label>
                    <label className="flex items-center justify-between gap-2 font-mono text-mini text-muted-foreground">
                      TO
                      <input
                        type="datetime-local"
                        value={toLocalInput(to)}
                        onChange={(e) => setTo(e.target.value)}
                        className={dateInputClass}
                      />
                    </label>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <button key={r} onClick={() => selectPresetRange(r)} className={rangeBtnClass(range === r)}>
                {r}
              </button>
            )
          )}
        </div>

        <Select value={mode} onValueChange={(v) => v && setParams({ mode: v as typeof mode })}>
          <SelectTrigger className="h-7 w-32 rounded-none border-edge bg-muted/50 font-mono text-xs">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-popover">
            {DATA_MODES.map(m => (
              <SelectItem key={m} value={m} className="font-mono text-xs uppercase">{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className={`h-6 rounded-none font-mono text-micro uppercase tracking-[0.08em] ${badge.className}`}>
          <Database className="mr-1 h-3 w-3" />
          {badge.label}
        </Badge>

        <Badge
          variant="outline"
          className={`h-6 rounded-none font-mono text-micro uppercase tracking-[0.08em] ${
            status === 'connected' && !isPaused
              ? 'border-live/50 bg-live/10 text-live'
              : 'border-warn/50 bg-warn/10 text-warn'
          }`}
        >
          {status === 'connected' && !isPaused ? (
            <span className="relative mr-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-live opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex h-2 w-2 bg-live"></span>
            </span>
          ) : status === 'disconnected' ? (
            <WifiOff className="mr-1 h-3 w-3" />
          ) : (
            <Activity className="mr-1 h-3 w-3" />
          )}
          {isPaused ? 'PAUSED' : status}
        </Badge>

        <div className="font-mono text-mini text-muted-foreground">
          {bufferInfo}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePause}
          className="h-7 rounded-none border-edge font-mono text-xs uppercase"
        >
          {isPaused ? <Play className="mr-1 h-3 w-3" /> : <Pause className="mr-1 h-3 w-3" />}
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
    </header>
  );
}
