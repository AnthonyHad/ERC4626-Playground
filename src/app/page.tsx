import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1> Welcome to my first Dapp</h1>
      <ConnectButton />
    </main>
  );
}
