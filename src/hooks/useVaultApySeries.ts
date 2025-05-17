// src/hooks/useVaultApySeries.ts
import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { erc4626VaultAbi } from "@/abis/erc4626Vault";
import type { Abi } from "abitype";

export interface ApyPoint {
  date: string; // "YYYY-MM-DD"
  apy: number; // e.g. 0.0321 = 3.21%
}

interface DayData {
  timestamp: number;
  sharePrice: number; // totalAssets/totalSupply
  supply: number; // normalized by decimals
}

const SECS_PER_DAY = 86_400;
const SECS_PER_YEAR = 31_536_000;

// fetch the nearest block for a given UTC‐midnight date
async function dateToBlock(date: Date): Promise<bigint> {
  const ts = Math.floor(date.getTime() / 1000);
  const res = await fetch(`https://coins.llama.fi/block/ethereum/${ts}`);
  const { height } = (await res.json()) as { height: number };
  return BigInt(height);
}

export function useVaultApySeries(vault: `0x${string}`, days = 30): ApyPoint[] {
  const client = usePublicClient();
  const [series, setSeries] = useState<ApyPoint[]>([]);

  useEffect(() => {
    if (!vault || !client) return;
    let cancelled = false;

    (async () => {
      // 1) Build last‐N‐days at midnight UTC
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const dates = Array.from(
        { length: days + 1 },
        (_, i) => new Date(today.getTime() - (days - i) * SECS_PER_DAY * 1000)
      );

      // 2) Resolve to block numbers
      const blocks = await Promise.all(dates.map(dateToBlock));

      // 3) Read decimals once
      const shareDecimals = Number(
        await client.readContract({
          address: vault,
          abi: erc4626VaultAbi as Abi,
          functionName: "decimals",
        })
      );

      // 4) Multicall totalAssets + totalSupply at each block
      const calls = blocks.flatMap((blockNumber) => [
        {
          address: vault,
          abi: erc4626VaultAbi as Abi,
          functionName: "totalAssets" as const,
          blockNumber,
        },
        {
          address: vault,
          abi: erc4626VaultAbi as Abi,
          functionName: "totalSupply" as const,
          blockNumber,
        },
      ]);
      const raw = await client.multicall<(bigint | undefined)[]>({
        contracts: calls,
        allowFailure: true,
      });

      // 5) Build a DayData[] with sharePrice & supply
      const data: DayData[] = blocks
        .map((_, i) => {
          const a = raw[2 * i]?.result as bigint | undefined;
          const s = raw[2 * i + 1]?.result as bigint | undefined;
          if (a === undefined || s === undefined || s === 0n) return null;
          const assets = Number(formatUnits(a, shareDecimals));
          const supply = Number(formatUnits(s, shareDecimals));
          return {
            timestamp: dates[i].getTime() / 1000,
            sharePrice: assets / supply,
            supply,
          };
        })
        .filter((x): x is DayData => !!x);

      console.log("data", data);

      // 6) Compute APY day-by-day
      const apySeries: ApyPoint[] = [];
      for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const curr = data[i];

        // if sharePrice actually moved, use it; otherwise use supply-growth
        const priceDelta = curr.sharePrice / prev.sharePrice - 1;
        const supplyDelta = curr.supply / prev.supply - 1;
        const rawReturn =
          Math.abs(priceDelta) > 1e-8 ? priceDelta : supplyDelta;

        // annualise the 1-day return
        const apy =
          Math.pow(
            1 + rawReturn,
            SECS_PER_YEAR / (curr.timestamp - prev.timestamp)
          ) - 1;
        apySeries.push({
          date: new Date(curr.timestamp * 1000).toISOString().slice(0, 10),
          apy,
        });
      }

      if (!cancelled) setSeries(apySeries);
    })();

    return () => {
      cancelled = true;
    };
  }, [vault, client, days]);

  return series;
}
