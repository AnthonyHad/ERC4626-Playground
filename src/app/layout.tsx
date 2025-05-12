import type { Metadata } from "next";
import "./globals.css";

import { Web3Providers } from "./providers";

export const metadata: Metadata = {
  title: "ERC4626 Vault Explorer",
  description: "A deeper look into ERC4626 vaults",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
