import { kv } from "@vercel/kv";
import { createHash } from "crypto";

// ---------------------------------------------------------------------------
// Key builders
// ---------------------------------------------------------------------------
const K = {
  caso:     (ts: number, rand: string)              => `caso:${ts}:${rand}`,
  rankLoja: (date: string)                          => `rank:loja:${date}`,
  rankProb: (storeId: string, date: string)         => `rank:prob:${storeId}:${date}`,
  rankVal:  (storeId: string, date: string)         => `rank:val:${storeId}:${date}`,
  email:    (hash: string)                          => `email:${hash}`,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function utcDateStr(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function datesFor(diasAtras: number): string[] {
  return Array.from({ length: diasAtras }, (_, i) => utcDateStr(i));
}

function parsePairs(raw: unknown): Array<[string, number]> {
  if (!Array.isArray(raw) || raw.length < 2) return [];
  const pairs: Array<[string, number]> = [];
  for (let i = 0; i + 1 < raw.length; i += 2) {
    pairs.push([String(raw[i]), Number(raw[i + 1])]);
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function registrarCaso(data: {
  storeId: string;
  problemId: string;
  valueRange: string | null;
}): Promise<void> {
  const ts   = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const date = utcDateStr();

  const p = kv.pipeline();
  p.hset(K.caso(ts, rand), {
    storeId:    data.storeId,
    problemId:  data.problemId,
    valueRange: data.valueRange ?? "",
    ts,
  });
  p.zincrby(K.rankLoja(date), 1, data.storeId);
  p.zincrby(K.rankProb(data.storeId, date), 1, data.problemId);
  if (data.valueRange) {
    p.zincrby(K.rankVal(data.storeId, date), 1, data.valueRange);
  }
  await p.exec();
}

export async function capturarEmail(data: {
  email: string;
  storeId: string;
  problemId: string;
}): Promise<void> {
  const hash = createHash("md5").update(data.email.toLowerCase()).digest("hex");
  await kv.set(
    K.email(hash),
    JSON.stringify({
      email:     data.email,
      storeId:   data.storeId,
      problemId: data.problemId,
      ts:        Date.now(),
    }),
    { nx: true }, // set only if not exists — dedup
  );
}

export async function getRankingLojas(diasAtras = 30): Promise<Array<{
  storeId: string;
  total: number;
  problemaMaisComum: string | null;
}>> {
  const dates = datesFor(diasAtras);
  const totals = new Map<string, number>();

  // Round trip 1: get all daily loja rankings
  const p1 = kv.pipeline();
  for (const date of dates) {
    p1.zrange(K.rankLoja(date), 0, -1, { withScores: true });
  }
  const lojaResults = (await p1.exec()) as unknown[][];

  for (const raw of lojaResults) {
    for (const [storeId, score] of parsePairs(raw)) {
      totals.set(storeId, (totals.get(storeId) ?? 0) + score);
    }
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return [];

  // Round trip 2: get problem breakdown for each store
  const p2 = kv.pipeline();
  for (const [storeId] of sorted) {
    for (const date of dates) {
      p2.zrange(K.rankProb(storeId, date), 0, -1, { withScores: true });
    }
  }
  const probResults = (await p2.exec()) as unknown[][];

  return sorted.map(([storeId, total], si) => {
    const probTotals = new Map<string, number>();
    for (let d = 0; d < diasAtras; d++) {
      for (const [prob, score] of parsePairs(probResults[si * diasAtras + d])) {
        probTotals.set(prob, (probTotals.get(prob) ?? 0) + score);
      }
    }
    const top = [...probTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    return { storeId, total, problemaMaisComum: top?.[0] ?? null };
  });
}

export async function getStatsLoja(storeId: string, diasAtras = 30): Promise<{
  total: number;
  porProblema: Record<string, number>;
  porValueRange: Record<string, number>;
}> {
  const dates = datesFor(diasAtras);

  // Single round trip: 3 queries per day (zscore + 2 zrange)
  const p = kv.pipeline();
  for (const date of dates) {
    p.zscore(K.rankLoja(date), storeId);
    p.zrange(K.rankProb(storeId, date), 0, -1, { withScores: true });
    p.zrange(K.rankVal(storeId, date), 0, -1, { withScores: true });
  }
  const results = (await p.exec()) as unknown[];

  let total = 0;
  const porProblema:   Record<string, number> = {};
  const porValueRange: Record<string, number> = {};

  for (let d = 0; d < dates.length; d++) {
    const base     = d * 3;
    const score    = results[base];
    const probRaw  = results[base + 1];
    const valRaw   = results[base + 2];

    if (typeof score === "number") total += score;

    for (const [prob, s] of parsePairs(probRaw)) {
      porProblema[prob] = (porProblema[prob] ?? 0) + s;
    }
    for (const [range, s] of parsePairs(valRaw)) {
      porValueRange[range] = (porValueRange[range] ?? 0) + s;
    }
  }

  return { total, porProblema, porValueRange };
}
