import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../utils/api";

import Navbar from "~/components/Navbar";
import NftUpload from "~/components/NftUpload";
import useWalletStore, { getWalletAddress } from "~/store/useWalletStore";
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import { XMarkIcon } from "@heroicons/react/24/outline";

const settings = {
  apiKey: "7H2-IaYHE7hFfMqYuENjF3tAp-G9BR8Z",
  network: Network.ETH_MAINNET,
};

interface Props {
  formId: string;
  loaderId: string;
  onSubmit: (formData: FormData) => Promise<any>;
}

const create: React.FC<Props> = ({ formId, loaderId, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [selectedNft, setSelectedNft] = useState<OwnedNft>();
  const [ticketSupply, setTicketSupply] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [raffleEndDate, setRaffleEndDate] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const router = useRouter();

  const walletAddress = useWalletStore((state) => state.walletAddress);
  const alchemy = new Alchemy(settings);

  const { mutateAsync: createRaffle } = api.raffle.createRaffle.useMutation({
    onSuccess: () => {
      console.log("Success User");
    },
    onError: (err) => {
      console.log("FAILURE User", err);
    },
  });

  //grab the connected wallet from the zustand store if it exists
  useEffect(() => {
    console.log("wallet address changed");
    getWalletAddress();
  }, []);

  //allow for scrolling on the modal if necessary
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, setIsOpen]);

  async function getOwnerNfts(): Promise<OwnedNftsResponse> {
    return alchemy.nft.getNftsForOwner(walletAddress!);
  }

  async function getNftDetails() {
    try {
      const nfts = await getOwnerNfts();
      const mappedNfts = nfts.ownedNfts.map((nft) => {
        // Perform mapping operation on each NFT object
        const contractAddress = nft.contract.address;
        const id = nft.tokenId;

        return { id, contractAddress };
      });
      setNfts(nfts.ownedNfts);
      console.log(nfts.ownedNfts);
    } catch (error) {
      console.log(error);
    }
  }

  const triggerModal = () => {
    setIsOpen(true);
    getNftDetails();
  };

  const handleNftSelect = (nft: OwnedNft) => {
    setSelectedNft(nft);
    console.log(nft);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormLoading(true);
    const formData = new FormData(e.currentTarget);
    // console.log("submitting form");
    // console.log(selectedNft);
    // console.log(ticketSupply);
    // console.log(ticketPrice);
    // console.log(raffleEndDate);

    try {
      // Call the onSubmit function with the form data
      // await onSubmit(formData);
      console.log("submitting form");
      console.log(selectedNft);
      console.log(ticketSupply);
      console.log(ticketPrice);
      console.log(raffleEndDate);
      const dateString = "2022-02-28T10:00:00.000Z";

      let response = await createRaffle({
        ticketSupply: ticketSupply,
        ticketPrice: ticketPrice,
        ticketsSold: 0,
        endDate: new Date(dateString),
        nftContractAddress: selectedNft?.contract.address!,
        nftTokenId: selectedNft?.tokenId!,
        nftTokenURI: selectedNft?.rawMetadata?.image!,
        nftTokenName: selectedNft?.rawMetadata?.name!,
        nftCollectionName: selectedNft?.contract.openSea?.collectionName!,
        winnerWalletAddress: "",
        creatorWalletAddress: walletAddress!,
      });

      console.log("here is the response from creating the raffle: ", response);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsFormLoading(false);
        router.push("/");
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h1 className="mt-8 text-4xl">Create a new Raffle</h1>
        {/* Main 3 column grid */}
        <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-4 rounded ">
            <section aria-labelledby="section-1-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  {!selectedNft ? (
                    <NftUpload
                      onClick={() => {
                        triggerModal();
                      }}
                    />
                  ) : (
                    <div className=" flex flex-col items-center rounded border">
                      <Image
                        src={selectedNft.rawMetadata?.image!}
                        alt="user NFT"
                        width={200}
                        height={200}
                        className="items-center"
                      />
                      <p className="text-md my-2 block truncate pl-2 text-left font-medium text-gray-500">
                        {selectedNft.contract.openSea?.collectionName}
                      </p>
                      <p className="text-md my-2 block truncate pl-2 text-left font-medium text-gray-900">
                        {selectedNft.rawMetadata?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {isOpen && (
            <div className="fixed top-0 left-0 z-10 h-full w-full backdrop-brightness-50">
              <div className="fixed top-1/2 left-1/2 z-20 h-4/5 w-full -translate-y-1/2 -translate-x-1/2 overflow-auto bg-gray-50 p-20 lg:w-[64rem]">
                <button
                  className=" absolute top-6 right-6"
                  onClick={() => setIsOpen(false)}
                >
                  <XMarkIcon className=" h-8 w-8" />
                </button>
                <ul
                  role="list"
                  className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                >
                  {nfts.map((nft) => (
                    <div key={nft.tokenId}>
                      <button
                        className="inline-block w-[200px] rounded border-2 border-off hover:border-secondary"
                        onClick={() => handleNftSelect(nft)}
                      >
                        <div className="">
                          {!isImageLoaded && (
                            <div className="">
                              <Image
                                src="/rings.svg"
                                alt="loader"
                                width={200}
                                height={200}
                              />
                            </div>
                          )}
                          <Image
                            src={nft.rawMetadata?.image!}
                            alt="user NFT"
                            width={200}
                            height={200}
                            onLoad={() => setIsImageLoaded(true)}
                            loading="lazy"
                          />
                        </div>

                        <p className="text-md my-2 block truncate pl-2 text-left font-medium text-gray-500">
                          {nft.contract.openSea?.collectionName}
                        </p>
                        <p className="text-md my-2 block truncate pl-2 text-left font-medium text-gray-900">
                          {nft.rawMetadata?.name}
                        </p>
                      </button>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4 rounded border lg:col-span-2">
            <section aria-labelledby="section-2-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2
                    id="section-2-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Raffle Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This information can only be set once so make sure it's
                    correct.
                  </p>

                  {isFormLoading ? (
                    <div
                      id={loaderId}
                      className="mt-8 flex items-center justify-center"
                    >
                      <Image
                        src="/bars.svg"
                        alt="form loader"
                        height={50}
                        width={50}
                      />
                    </div>
                  ) : (
                    <form method="POST" onSubmit={handleFormSubmit} id={formId}>
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Total Ticket Supply
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="company-website"
                            id="company-website"
                            className="block rounded-md border-2 border-light shadow-sm hover:border-secondary focus:border-secondary"
                            onChange={(e) => {
                              setTicketSupply(parseInt(e.target.value));
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Ticket Price (in MATIC)
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="company-website"
                            id="company-website"
                            className="block rounded-md border-2 border-light shadow-sm hover:border-secondary focus:border-secondary"
                            onChange={(e) => {
                              setTicketPrice(parseInt(e.target.value));
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Raffle End Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="company-website"
                            id="company-website"
                            className="block rounded-md border-2 border-light shadow-sm hover:border-secondary focus:border-secondary"
                            onChange={(e) => {
                              setRaffleEndDate(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6 mr-6 flex flex-row justify-end">
                        <button
                          className="relative flex flex-row items-center  justify-end rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default create;
