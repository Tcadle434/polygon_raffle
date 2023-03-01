import create from "zustand";
import { ethers } from "ethers";

type WalletStore = {
  walletAddress: string | null;
  chainId: number | null;
  setWalletAddress: (address: string | null) => void;
  setChainId: (id: number | null) => void;
};

const useWalletStore = create<WalletStore>((set) => ({
  walletAddress: null,
  chainId: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setChainId: (id) => set({ chainId: id }),
}));

export const getWalletAddress = async () => {
  if (typeof window.ethereum !== "undefined") {
    // Connect to the user's wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    useWalletStore.setState({ walletAddress: address });
    useWalletStore.setState({ chainId: chainId });
  } else {
    // User doesn't have a wallet connected
    useWalletStore.setState({ walletAddress: null });
    // useWalletStore.setState({ chainId: null });
  }
};

export const disconnectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    // Disconnect from the user's wallet
    useWalletStore.setState({ walletAddress: null });
    // useWalletStore.setState({ chainId: null });
  }
};

export default useWalletStore;
