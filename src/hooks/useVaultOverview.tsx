import { useReadContracts } from "wagmi";
import { erc4626VaultAbi } from "@/abis/erc4626Vault";

export function useVaultOverview(vaultAddress: `0x${string}`) {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: vaultAddress,
        abi: erc4626VaultAbi,
        functionName: "name",
      },
      {
        address: vaultAddress,
        abi: erc4626VaultAbi,
        functionName: "symbol",
      },
      {
        address: vaultAddress,
        abi: erc4626VaultAbi,
        functionName: "totalAssets",
      },
      {
        address: vaultAddress,
        abi: erc4626VaultAbi,
        functionName: "totalSupply",
      },
      {
        address: vaultAddress,
        abi: erc4626VaultAbi,
        functionName: "isShutdown",
      },
    ],
  });

  const [name, symbol, totalAssets, totalSupply, isShutdown] = data || [];

  return {
    name: name?.result as string | undefined,
    symbol: symbol?.result as string | undefined,
    totalAssets: totalAssets?.result as bigint | undefined,
    totalSupply: totalSupply?.result as bigint | undefined,
    isShutdown: isShutdown?.result as boolean | undefined,
    isLoading,
    error,
  };
}
