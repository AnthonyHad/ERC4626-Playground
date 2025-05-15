// components/VaultStats.tsx
"use client";

import { useVaultAssetInfo } from "@/hooks/useVaultAssetInfo";
import { useVaultOverview } from "@/hooks/useVaultOverview";

// 1) import your chart
// ✅ relative to the same folder
import VaultApyChart from "./vaultApyChart";

export default function VaultStats({ address }: { address: `0x${string}` }) {
  const {
    name,
    symbol,
    totalAssets,
    totalSupply,
    isShutdown,
    decimals,
    isLoading,
  } = useVaultOverview(address);

  const {
    assetName,
    assetSymbol,
    assetDecimals,
    isLoading: assetLoading,
  } = useVaultAssetInfo(address);

  if (isLoading || assetLoading) return <p>Loading...</p>;

  const sharePrice =
    totalAssets && totalSupply
      ? Number(totalAssets) /
        10 ** assetDecimals! /
        (Number(totalSupply) / 10 ** decimals!)
      : undefined;

  return (
    <div>
      <h1>
        {name} ({symbol})
      </h1>
      <p>
        Underlying: {assetName} ({assetSymbol})
      </p>
      <p>
        TVL: {(Number(totalAssets) / 10 ** (assetDecimals ?? 6)).toFixed(2)}{" "}
        {assetSymbol}
      </p>
      <p>Shares: {(Number(totalSupply) / 10 ** (decimals ?? 18)).toFixed(2)}</p>
      <p>Share Price: {sharePrice?.toFixed(6)}</p>
      <p>Status: {isShutdown ? "Shutdown" : "Active"}</p>

      {/* 2) render the chart */}
      <div style={{ marginTop: 24 }}>
        <h2 className="text-lg mb-2">Historic APY (last 90 days)</h2>
        <VaultApyChart vault={address} days={5} />
      </div>
    </div>
  );
}
