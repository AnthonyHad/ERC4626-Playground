import { ConnectButton } from "@rainbow-me/rainbowkit";

import VaultStats from "@/components/vaultStats";

const vaultAddress = "0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204";

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
