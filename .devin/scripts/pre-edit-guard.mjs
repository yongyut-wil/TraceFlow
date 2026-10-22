import fs from 'node:fs';

try {
  const raw = fs.readFileSync(0, 'utf8');
  const payload = raw ? JSON.parse(raw) : {};
  const input = payload.tool_input || {};

  const filePath = String(input.file_path || input.path || '').replace(/\\/g, '/');
  const isCodeFile = /\.(ts|tsx|js|jsx|mjs)$/.test(filePath);
  const isSharedMcpConfig = /\.devin\/mcp_config\.json$/.test(filePath);

  const fullCandidateText = [
    input.content || '',
    input.new_string || '',
    input.patch || '',
  ].join('\n');

  const secretMatch = fullCandidateText.match(
    /\b(sbp_[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[bpoas]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|sk-proj-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/
  );
  if (secretMatch) {
    console.log(
      JSON.stringify({
        decision: 'block',
        reason: `Blocked write containing a literal credential pattern ('${secretMatch[1].slice(0, 10)}...'). Never write secrets to files — use \${env:VAR} or \${file:/path} expansion, or .devin/mcp_config.local.json (gitignored).`,
      })
    );
    process.exit(0);
  }

  if (isSharedMcpConfig) {
    const envLikeBlocks = fullCandidateText.match(
      /"(?:env|headers)"\s*:\s*\{[^}]*\}/g
    );
    const hasHardcodedValue = (envLikeBlocks || []).some((block) =>
      /"[^"\s]+"\s*:\s*"(?!\$\{)[^"\s]{8,}"/.test(block)
    );
    if (hasHardcodedValue) {
      console.log(
        JSON.stringify({
          decision: 'block',
          reason:
            'Blocked hardcoded value in env/headers of the shared .devin/mcp_config.json. Use ${env:VAR}/${file:/path} references, or put literal values in .devin/mcp_config.local.json (gitignored).',
        })
      );
      process.exit(0);
    }
  }

  if (isCodeFile) {
    const candidateText = fullCandidateText;

    if (/from\s+['"]echarts['"]/.test(candidateText)) {
      console.log(
        JSON.stringify({
          decision: 'block',
          reason:
            "Blocked full bundle import `from 'echarts'`. Use modular imports (`echarts/core`, `echarts/charts`, `echarts/components`, `echarts/renderers`) per TraceFlow architecture rules.",
        })
      );
      process.exit(0);
    }

    const forbiddenChartMatch = candidateText.match(
      /from\s+['"](recharts|chart\.js|react-chartjs-2|echarts-for-react)['"]/
    );
    if (forbiddenChartMatch) {
      console.log(
        JSON.stringify({
          decision: 'block',
          reason: `Blocked forbidden library '${forbiddenChartMatch[1]}'. TraceFlow strictly requires custom '<EChartCanvas />' built on 'echarts/core' + 'CanvasRenderer'.`,
        })
      );
      process.exit(0);
    }
  }

  process.exit(0);
} catch {
  process.exit(0);
}
