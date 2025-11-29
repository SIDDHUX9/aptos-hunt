import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren, useMemo } from "react";
import { Network } from "@aptos-labs/ts-sdk";

export function AptosWalletProvider({ children }: PropsWithChildren) {
  // Memoize wallets to prevent re-instantiation on every render
  const wallets = useMemo(() => [new PetraWallet()], []);

  return (
    <AptosWalletAdapterProvider
      // @ts-ignore - plugins prop exists in the provider but types might be mismatched in this version
      plugins={wallets}
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error: any) => {
        console.log("wallet error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}