import React from "react";
import { useEffect } from "react";

import Navbar from "~/components/Navbar";
import NftUpload from "~/components/NftUpload";
import useWalletStore, { getWalletAddress } from "~/store/useWalletStore";
import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: "7H2-IaYHE7hFfMqYuENjF3tAp-G9BR8Z",
  network: Network.ETH_MAINNET,
};

const create = () => {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const alchemy = new Alchemy(settings);

  //grab the connected wallet from the zustand store if it exists
  useEffect(() => {
    console.log("wallet address changed");
    getWalletAddress();
  }, []);

  // Print all NFTs returned in the response:
  const getOwnerNfts = async () => {
    console.log(walletAddress);
    await alchemy.nft.getNftsForOwner(walletAddress!).then(console.log);
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mt-8 text-4xl">Create a new Raffle</h1>
        {/* Main 3 column grid */}
        <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-4 rounded border">
            <section aria-labelledby="section-1-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <NftUpload
                    onClick={() => {
                      getOwnerNfts();
                    }}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4 rounded border lg:col-span-2">
            <section aria-labelledby="section-2-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">{/* Your content */}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default create;
