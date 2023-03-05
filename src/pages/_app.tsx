import { type AppType } from "next/app";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { EthereumClient, modalConnectors } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import "~/styles/globals.css";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
// const chains = [polygon];
// const chains = [polygonMumbai];

// const { provider } = configureChains(chains, [
//   walletConnectProvider({ projectId }),
// ]);

const { chains, provider } = configureChains(
  [polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://rpc.buildbear.io/Operational_Grievous_4a93981d`,
      }),
    }),
  ]
);

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
