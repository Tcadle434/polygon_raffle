import { type AppType } from "next/app";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import "~/styles/globals.css";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, polygonMumbai } from "wagmi/chains";
// import { Chain } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
// const chains = [polygonMumbai];

const { chains, provider } = configureChains(
  [polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://rpc.dev.buildbear.io/Cooing_Zam_Wesell_8ec808a5`,
      }),
    }),
  ]
);

// const { provider } = configureChains(chains, [
//   walletConnectProvider({ projectId }),
// ]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    version: "1",
    appName: "web3Modal",
    chains,
    projectId,
  }),
  provider,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const MyApp: AppType = ({ Component, pageProps }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);

    // Reload page on chain or account change
    if (window.ethereum) {
      window.ethereum.on!("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on!("accountsChanged", () => {
        window.location.reload();
      });
      // window.ethereum.on!("wallet_disconnect", () => {
      //   window.location.reload();
      // });
    }
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeColor="teal"
      />
    </>
  );
};

export default api.withTRPC(MyApp);
