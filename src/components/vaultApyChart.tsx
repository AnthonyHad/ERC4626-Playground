// components/VaultApyChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useVaultPriceSeries } from "@/hooks/useVaultPriceSeries";
import { toApySeries, type ApyPoint } from "@/utils/toApySeries";

export default function VaultApyChart({
  vault,
  days = 90,
}: {
  vault: `0x${string}`;
  days?: number;
}) {
  // 1. Fetch the raw price-per-share history
  const priceSeries = useVaultPriceSeries(vault, days);

  // 2. Bail while loading or if not enough data
  if (priceSeries.length < 2) {
    return <p className="text-sm text-gray-500">Loading APY data…</p>;
  }

  // 3. Convert to APY series
  const data: ApyPoint[] = toApySeries(priceSeries);

  // 4. Render with Recharts
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis width={60} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
        <Tooltip
          formatter={(v: number) => `${(v * 100).toFixed(2)}%`}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="apy"
          dot={false}
          stroke="#3182ce"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
