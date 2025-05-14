import { erc4626VaultAbi } from "@/abis/erc4626Vault";
import { erc20Abi } from "@/abis/erc20";
import { useReadContract, useReadContracts } from "wagmi";

export function useVaultAssetInfo(vaultAddress: `0x${string}`) {
  const { data: assetAddress } = useReadContract({
    address: vaultAddress,
    abi: erc4626VaultAbi,
    functionName: "asset",
  });

  const { data, isLoading, error } = useReadContracts({
    query: { enabled: !!assetAddress }, // only fetch when asset is available
    contracts: assetAddress
      ? [
          {
            address: assetAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
          },
          {
            address: assetAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
          },
          {
            address: assetAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
          },
        ]
      : [],
  });

  const [name, symbol, decimals] = data || [];

  return {
    assetAddress,
    assetName: name?.result as string | undefined,
    assetSymbol: symbol?.result as string | undefined,
    assetDecimals: decimals?.result as number | undefined,
    isLoading,
    error,
  };
}
