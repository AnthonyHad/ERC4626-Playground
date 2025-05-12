"use client";

import { useReadContract } from "wagmi";
import { erc4626VaultAbi } from "@/abis/erc4626Vault";

const vaultAddress = "0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204";

export default function VaultStats() {
  const { data, isPending, error } = useReadContract({
    abi: erc4626VaultAbi,
    address: vaultAddress,
    functionName: "totalAssets",
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>Total Assets: {data?.toString()}</p>;
}
