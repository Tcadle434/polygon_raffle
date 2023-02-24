// Setup: npm install alchemy-sdk
// Github: https://github.com/alchemyplatform/alchemy-sdk-js
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "7H2-IaYHE7hFfMqYuENjF3tAp-G9BR8Z", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Print all NFTs returned in the response:
const getOwnerNfts = async () => {
  await alchemy.nft
    .getNftsForOwner("0x55c0f20123862aD1F6C1B235D06cCb5ebBe97414")
    .then(console.log);
};

getOwnerNfts();
