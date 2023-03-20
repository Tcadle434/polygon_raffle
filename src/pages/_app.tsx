import { type AppType } from "next/app";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Web3Modal } from "@web3modal/react";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import "~/styles/globals.css";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const chains = [polygon];

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
]);

// const { chains, provider } = configureChains(
//   [polygon],
//   [
//     jsonRpcProvider({
//       rpc: (chain) => ({
//         http: `https://rpc.buildbear.io/Enthusiastic_Palpatine_a518d1ca`,
//       }),
//     }),
//   ]
// );

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
