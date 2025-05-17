import { ConnectButton } from "@rainbow-me/rainbowkit";

import VaultStats from "@/components/vaultStats";

const vaultAddress = "0xF7DE3c70F2db39a188A81052d2f3C8e3e217822a";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1> Welcome to my first Dapp</h1>
      <ConnectButton />
      <div className="">
        <h2 className="text-2xl font-bold">Vault Stats</h2>
        <VaultStats address={vaultAddress} />
      </div>
    </main>
  );
}
