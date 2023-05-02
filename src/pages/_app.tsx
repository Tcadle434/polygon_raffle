import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { DynamicContextProvider, SortWallets } from "@dynamic-labs/sdk-react";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { env } from "~/env.mjs";
import "~/styles/globals.css";

// Setting up list of evmNetworks
const evmNetworks = [
  {
    blockExplorerUrls: ["https://polygonscan.com/"],
    chainId: 137,
    chainName: "Matic Mainnet",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/polygon.svg"],
    nativeCurrency: {
      decimals: 18,
      name: "MATIC",
      symbol: "MATIC",
    },
    networkId: 137,
    rpcUrls: ["https://polygon-rpc.com"],
    shortName: "MATIC",
    vanityName: "Polygon",
  },
];

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <DynamicContextProvider
        settings={{
          appLogoUrl: "/logo.png",
          appName: "Raffi3",
          environmentId: process.env.NEXT_PUBLIC_ENV_ID!,
          evmNetworks,
          walletsFilter: SortWallets([
            "phantomevm",
            "metamask",
            "walletconnect",
            "coinbase",
          ]),
          defaultNumberOfWalletsToShow: 4,
          newToWeb3WalletChainMap: {
            primary_chain: "evm",
            wallets: {
              evm: "phantomevm",
              solana: "phantom",
            },
          },
        }}
      >
        <DynamicWagmiConnector>
          <Component {...pageProps} />
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
