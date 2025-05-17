// components/VaultApyChart.tsx
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useVaultApySeries, type ApyPoint } from "@/hooks/useVaultApySeries";

export default function VaultApyChart({
  vault,
  days = 10,
}: {
  vault: `0x${string}`;
  days?: number;
}) {
  // 1) Fetch the APY series directly
  const data: ApyPoint[] = useVaultApySeries(vault, days);

  // 2) Bail if still loading or empty
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">Loading APY data…</p>;
  }

  // 3) Render the chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis width={60} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
        <Tooltip
          formatter={(v: number) => `${(v * 100).toFixed(2)}%`}
          labelFormatter={(d) => `Date: ${d}`}
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
