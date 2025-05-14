"use client";

import { useVaultOverview } from "@/hooks/useVaultOverview";

export default function VaultStats({ address }: { address: `0x${string}` }) {
  const {
    name,
    symbol,
    totalAssets,
    totalSupply,
    price,
    isShutdown,
    decimals,
    isLoading,
  } = useVaultOverview(address);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>
        {name} ({symbol})
      </h1>
      <p>TVL: {Number(totalAssets) / 1e6} USDC</p>
      <p>Shares: {Number(totalSupply) / 1e6}</p>
      <p>
        Share Price:{" "}
        {decimals !== undefined && price !== undefined
          ? (Number(price) / 10 ** 18).toFixed(6)
          : "Loading..."}
      </p>
      <p>Status: {isShutdown ? "Shutdown" : "Active"}</p>
    </div>
  );
}
