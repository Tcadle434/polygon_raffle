// Setup: npm install alchemy-sdk
// Github: https://github.com/alchemyplatform/alchemy-sdk-js
import {
  Alchemy,
  Network,
  AssetTransfersCategory,
  OwnedNftsResponse,
  OwnedNft,
} from "alchemy-sdk";
import { useState } from "react";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "7H2-IaYHE7hFfMqYuENjF3tAp-G9BR8Z", // Replace with your Alchemy API Key.
  network: Network.MATIC_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const [nftDataLoading, setNftDataLoading] = useState(false);
const [nfts, setNfts] = useState<OwnedNft[]>([]);

async function getOwnerNfts(): Promise<OwnedNftsResponse> {
  return alchemy.nft.getNftsForOwner(
    "0x55c0f20123862aD1F6C1B235D06cCb5ebBe97414"
  );
}

async function getNftDetails() {
  try {
    setNftDataLoading(true);
    const nfts = await getOwnerNfts();
    setNfts(nfts.ownedNfts);
    console.log(nfts.ownedNfts);
  } catch (error) {
    console.log(error);
  } finally {
    setNftDataLoading(false);
  }
}
getNftDetails();

// Print all NFTs returned in the response:
// const getOwnerNfts = async () => {
//   await alchemy.nft
//     .getNftsForOwner("0x55c0f20123862aD1F6C1B235D06cCb5ebBe97414")
//     .then((response) => {
//       console.log(response.);
//     });
// };

// getOwnerNfts();
