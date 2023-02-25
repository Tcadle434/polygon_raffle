import create from "zustand";
import { ethers } from "ethers";

type WalletStore = {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
};

const useWalletStore = create<WalletStore>((set) => ({
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
}));

export const getWalletAddress = async () => {
  if (typeof window.ethereum !== "undefined") {
    // Connect to the user's wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    useWalletStore.setState({ walletAddress: address });
  } else {
    // User doesn't have a wallet connected
    useWalletStore.setState({ walletAddress: null });
  }
};

export default useWalletStore;
