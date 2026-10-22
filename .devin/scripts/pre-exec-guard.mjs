import fs from 'node:fs';

try {
  const raw = fs.readFileSync(0, 'utf8');
  const payload = raw ? JSON.parse(raw) : {};
  const cmd = String(payload.tool_input?.command || '').trim();

  if (/(^|[;&|]\s*)(npm\s+(install|i|add|ci)|yarn(\s+|$))/.test(cmd)) {
    console.log(
      JSON.stringify({
        decision: 'block',
        reason:
          'TraceFlow strictly locks the package manager to `pnpm`. Replace `npm` / `yarn` commands with `pnpm`.',
      })
    );
    process.exit(0);
  }

  if (
    /git\s+reset\s+--hard/.test(cmd) ||
    /git\s+push\s+(--force|-f)/.test(cmd) ||
    /git\s+clean\s+-fd/.test(cmd)
  ) {
    console.log(
      JSON.stringify({
        decision: 'block',
        reason:
          'Destructive git command blocked by TraceFlow hook policy. Ask the user for explicit confirmation first.',
      })
    );
    process.exit(0);
  }

  process.exit(0);
} catch {
  process.exit(0);
}
