export {};

const projectId = "6f40891076a444a29fe2b43084e3f8a9";
const walletAddress = "0x11E7Fa3Bc863bceD1F1eC85B6EdC9b91FdD581CF";

async function getNfts() {
  try {
    const response = await fetch(
      `https://polygon-mainnet.infura.io/v3/6f40891076a444a29fe2b43084e3f8a9/account/${walletAddress}/nfts`
    );

    // if (!response.ok) {
    //   throw new Error("Failed to fetch NFTs");
    // }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Usage:
getNfts().then((nfts) => {
  if (nfts) {
    console.log(nfts);
  }
});
