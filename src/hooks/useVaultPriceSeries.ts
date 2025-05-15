// src/hooks/useVaultPriceSeries.ts
import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { erc4626VaultAbi } from "@/abis/erc4626Vault";
import type { Abi } from "abitype";

export type PricePoint = {
  blockNumber: bigint;
  timestamp: number;
  price: number;
};

const SECS_PER_DAY = 86_400;
// const SECS_PER_YEAR = 31_536_000;

export function useVaultPriceSeries(
  vault: `0x${string}`,
  days = 10
): PricePoint[] {
  const client = usePublicClient();
  const [series, setSeries] = useState<PricePoint[]>([]);

  useEffect(() => {
    if (!vault || !client) return;
    let cancelled = false;

    (async () => {
      // 1) Estimate blocks/day
      const latest = await client.getBlock();
      const prev = await client.getBlock({ blockNumber: latest.number - 5n });
      const avgBlockTime = Number(latest.timestamp - prev.timestamp) / 5;
      const blocksPerDay = Math.round(SECS_PER_DAY / avgBlockTime);

      // 2) Vault share-decimals
      const shareDecimals = Number(
        await client.readContract({
          address: vault,
          abi: erc4626VaultAbi as Abi,
          functionName: "decimals",
        })
      );

      // 3) Build list of historic blocks
      const blockNumbers = Array.from(
        { length: days + 1 },
        (_, i) => latest.number - BigInt(i * blocksPerDay)
      );

      // 4) Multicall with a precise generic: each slot is bigint | undefined
      const rawResults = await client.multicall<(bigint | undefined)[]>({
        contracts: blockNumbers.map((blockNumber) => ({
          address: vault,
          abi: erc4626VaultAbi as Abi,
          functionName: "previewRedeem" as const,
          args: [parseUnits("1", shareDecimals)],
          blockNumber,
        })),
        allowFailure: true,
      });
      // rawResults: (bigint | undefined)[]

      // 5) Fetch timestamps
      const blocks = await Promise.all(
        blockNumbers.map((bn) => client.getBlock({ blockNumber: bn }))
      );

      // 6) Map → PricePoint[], skipping any undefined results
      const pts = blockNumbers
        .map((blockNumber, i) => {
          const callResult = rawResults[i];
          // Handle multicall result object structure
          if (
            !callResult ||
            callResult.status !== "success" ||
            callResult.result === undefined
          )
            return null;
          return {
            blockNumber,
            timestamp: Number(blocks[i].timestamp),
            price: Number(
              formatUnits(callResult.result as bigint, shareDecimals)
            ),
          };
        })
        .filter((p): p is PricePoint => p !== null)
        .reverse(); // oldest → newest

      if (!cancelled) setSeries(pts);
    })();

    return () => {
      cancelled = true;
    };
  }, [vault, client, days]);

  return series;
}
