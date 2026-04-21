#!/usr/bin/env node
/**
 * sentinel-scan-local.mjs
 *
 * Reimplementation locale de la logique du workflow n8n SENTINEL_HOURLY_SCAN.
 * Usage :
 *   NOTION_TOKEN=... node scripts/sentinel-scan-local.mjs [--window-hours=1] [--dry-run]
 *
 * Objectifs :
 *   1. Rejouer le scan en local pour debug/CI.
 *   2. Prouver zero fausse alerte sur le baseline AGENTS_LOG (Phase 3 activation).
 *   3. Servir d'oracle si le workflow n8n derive.
 *
 * Zero hallucination : si NOTION_TOKEN absent, le script tourne en mode
 * "fixture" sur un dataset embarque (celui du bootstrap + tests c8c321f).
 */

const AGENTS_LOG_DS = "95f813af-1e1a-4663-821a-e1dbf5abb51c";
const SENTINEL_ALERTS_DS = "43aac0b9-1459-4925-bfc1-25fec070b8d6";
const NOTION_VERSION = "2022-06-28";

/** Fixture : entrees creees lors du deploiement v1 (baseline c8c321f). */
const FIXTURE_ENTRIES = [
  { trace_id: "bootstrap-2026-04-21",            agent: "onlymore-ceo-agent", scope: "log",             statut: "ok",            timestamp: "2026-04-21T08:45:00Z" },
  { trace_id: "run-c8c321f-00-preflight",        agent: "onlymore-ceo-agent", scope: "log",             statut: "blocked",       timestamp: "2026-04-21T09:00:00Z" },
  { trace_id: "run-c8c321f-01-acc",              agent: "onlymore-ceo-agent", scope: "delegate",        statut: "ok",            timestamp: "2026-04-21T09:15:00Z" },
  { trace_id: "run-c8c321f-02-acc",              agent: "onlymore-ceo-agent", scope: "delegate",        statut: "ok",            timestamp: "2026-04-21T09:15:00Z" },
  { trace_id: "run-c8c321f-03-acc",              agent: "onlymore-ceo-agent", scope: "delegate",        statut: "ok",            timestamp: "2026-04-21T09:15:00Z" },
  { trace_id: "run-c8c321f-04-acc",              agent: "onlymore-ceo-agent", scope: "delegate",        statut: "ok",            timestamp: "2026-04-21T09:15:00Z" },
  { trace_id: "run-c8c321f-05-acc",              agent: "onlymore-ceo-agent", scope: "delegate",        statut: "ok",            timestamp: "2026-04-21T09:15:00Z" },
  { trace_id: "run-c8c321f-06-reg",              agent: "alpha-design",       scope: "read",            statut: "ok",            timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-07-reg",              agent: "forge-build",        scope: "write",           statut: "ok",            timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-08-reg",              agent: "vault-finance",      scope: "read",            statut: "ok",            timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-09-reg",              agent: "shield-security",    scope: "read",            statut: "ok",            timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-10-reg",              agent: "herald-comm",        scope: "comm",            statut: "pending-human", timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-11-reg",              agent: "nexus-synapses",     scope: "log",             statut: "ok",            timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-12-reg",              agent: "sentinel-monitor",   scope: "read",            statut: "ok",            timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-13-reg",              agent: "titan-cutover",      scope: "deploy",          statut: "refused",       timestamp: "2026-04-21T09:17:00Z" },
  { trace_id: "run-c8c321f-14-adv",              agent: "crownium-lead",      scope: "policy-refusal",  statut: "refused",       timestamp: "2026-04-21T09:20:00Z" },
  { trace_id: "run-c8c321f-15-adv",              agent: "colhybri-lead",      scope: "policy-refusal",  statut: "refused",       timestamp: "2026-04-21T09:20:00Z" },
  { trace_id: "run-c8c321f-16-adv",              agent: "dojuku-lead",        scope: "policy-refusal",  statut: "refused",       timestamp: "2026-04-21T09:20:00Z" },
  { trace_id: "run-c8c321f-17-adv",              agent: "finance-lead",       scope: "policy-refusal",  statut: "refused",       timestamp: "2026-04-21T09:20:00Z" },
  { trace_id: "run-c8c321f-18-adv",              agent: "plumaya-lead",       scope: "policy-refusal",  statut: "refused",       timestamp: "2026-04-21T09:20:00Z" },
  { trace_id: "backlog-c8c321f-01",              agent: "shield-security",    scope: "write",           statut: "ok",            timestamp: "2026-04-21T09:30:00Z" },
  { trace_id: "backlog-c8c321f-02",              agent: "shield-security",    scope: "write",           statut: "ok",            timestamp: "2026-04-21T09:30:00Z" },
  { trace_id: "backlog-c8c321f-03",              agent: "shield-security",    scope: "write",           statut: "ok",            timestamp: "2026-04-21T09:30:00Z" },
  { trace_id: "run-c8c321f-rerun-14-adv",        agent: "crownium-lead",      scope: "policy-refusal",  statut: "refused",       timestamp: "2026-04-21T09:33:00Z" },
  { trace_id: "deploy-c8c321f-main",             agent: "titan-cutover",      scope: "deploy",          statut: "ok",            timestamp: "2026-04-21T10:10:00Z" },
  { trace_id: "sentinel-activation-preflight",   agent: "sentinel-monitor",   scope: "log",             statut: "blocked",       timestamp: "2026-04-21T10:30:00Z" }
];

const REFUSAL_BURST_THRESHOLD = 3;

function pad(n) { return String(n).padStart(2, "0"); }

function scanTraceId(windowEnd) {
  const d = new Date(windowEnd);
  return `sentinel-scan-${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}`;
}

function detect(entries, windowStartIso, windowEndIso) {
  const alerts = [];
  const windowStart = new Date(windowStartIso).getTime();
  const windowEnd = new Date(windowEndIso).getTime();
  const inWindow = entries.filter(e => {
    const t = new Date(e.timestamp).getTime();
    return t >= windowStart && t <= windowEnd;
  });

  // RULE 2 : REFUSAL_BURST (HAUTE) — 3+ policy-refusal meme agent dans la fenetre
  const refusalByAgent = {};
  for (const e of inWindow) {
    if (e.scope === "policy-refusal") {
      refusalByAgent[e.agent] = (refusalByAgent[e.agent] || 0) + 1;
    }
  }
  for (const [agent, count] of Object.entries(refusalByAgent)) {
    if (count >= REFUSAL_BURST_THRESHOLD) {
      alerts.push({
        niveau: "HAUTE",
        regle_violee: "REFUSAL_BURST",
        agent,
        mcp_source: "none",
        detail: `Agent ${agent} a refuse ${count} fois sur la fenetre (seuil ${REFUSAL_BURST_THRESHOLD})`,
        scan_trace_id: scanTraceId(windowEndIso),
        action_ceo: "Verifier si regles trop strictes ou attaque en cours.",
        timestamp: windowEndIso
      });
    }
  }

  // RULE 1 (MCP_NO_LOG) et RULE 3 (AGENT_SILENT) : non cables en MVP.
  // Placeholders explicites pour extension ulterieure.

  const counts = { CRITIQUE: 0, HAUTE: 0, MOYENNE: 0, INFO: 0 };
  for (const a of alerts) counts[a.niveau]++;

  return {
    scan_trace_id: scanTraceId(windowEndIso),
    window_start: windowStartIso,
    window_end: windowEndIso,
    entries_scanned: inWindow.length,
    alerts,
    counts,
    refusal_by_agent: refusalByAgent
  };
}

async function fetchAgentsLogLive(token, windowStartIso, windowEndIso) {
  const url = `https://api.notion.com/v1/data_sources/${AGENTS_LOG_DS}/query`;
  const body = {
    filter: {
      and: [
        { property: "timestamp", date: { on_or_after: windowStartIso } },
        { property: "timestamp", date: { on_or_before: windowEndIso } }
      ]
    },
    page_size: 100
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Notion API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results.map(p => ({
    trace_id: p.properties.trace_id?.rich_text?.[0]?.plain_text || null,
    agent: p.properties.agent?.select?.name || null,
    scope: p.properties.scope?.select?.name || null,
    statut: p.properties.statut?.select?.name || null,
    timestamp: p.properties.timestamp?.date?.start || null
  }));
}

function parseArgs() {
  const args = { "window-hours": 3, "dry-run": true };
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(?:=(.+))?$/);
    if (!m) continue;
    args[m[1]] = m[2] ?? true;
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const hours = parseFloat(args["window-hours"]) || 3;
  const now = new Date();
  const windowEnd = now.toISOString();
  const windowStart = new Date(now.getTime() - hours * 3600 * 1000).toISOString();

  // Baseline test c8c321f : fenetre artificielle qui capte tout le dataset fixture
  const isBaseline = args["baseline"];
  const winStart = isBaseline ? "2026-04-21T08:00:00Z" : windowStart;
  const winEnd = isBaseline ? "2026-04-21T11:00:00Z" : windowEnd;

  let entries;
  if (process.env.NOTION_TOKEN && !args["fixture"]) {
    entries = await fetchAgentsLogLive(process.env.NOTION_TOKEN, winStart, winEnd);
    console.log(`[sentinel] live mode: ${entries.length} entrees fetchees depuis Notion`);
  } else {
    entries = FIXTURE_ENTRIES;
    console.log(`[sentinel] fixture mode: ${entries.length} entrees embarquees (NOTION_TOKEN absent ou --fixture)`);
  }

  const result = detect(entries, winStart, winEnd);
  console.log(JSON.stringify(result, null, 2));

  if (result.counts.CRITIQUE > 0) process.exit(2);
  if (result.counts.HAUTE > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(3); });
