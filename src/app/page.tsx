import { ConnectButton } from "@rainbow-me/rainbowkit";

import VaultStats from "@/components/vault-stats";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1> Welcome to my first Dapp</h1>
      <ConnectButton />
      <div className="">
        <h2 className="text-2xl font-bold">Vault Stats</h2>
        <VaultStats />
      </div>
    </main>
  );
}
