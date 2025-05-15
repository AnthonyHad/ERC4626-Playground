// utils/toApySeries.ts
const SECS_PER_YEAR = 31_536_000;

export type ApyPoint = { date: string; apy: number };

/**
 * Given an array of { timestamp, price } points (chronological),
 * returns one APY point per interval, with dates formatted
 */
export function toApySeries(
  priceSeries: { timestamp: number; price: number }[]
): ApyPoint[] {
  const out: ApyPoint[] = [];
  for (let i = 1; i < priceSeries.length; i++) {
    const { timestamp: t0, price: p0 } = priceSeries[i - 1];
    const { timestamp: t1, price: p1 } = priceSeries[i];
    const apr = p1 / p0 - 1; // simple period return
    const apy = Math.pow(1 + apr, SECS_PER_YEAR / (t1 - t0)) - 1;
    out.push({
      date: new Date(t1 * 1000).toISOString().slice(0, 10),
      apy,
    });
  }
  return out;
}
