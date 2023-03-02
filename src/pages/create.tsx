import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Navbar from "~/components/Navbar";
import NftUpload from "~/components/NftUpload";
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const settings = {
  // apiKey: "7H2-IaYHE7hFfMqYuENjF3tAp-G9BR8Z",
  // network: Network.ETH_MAINNET,
  apiKey: "HRtcdn0En4LLGdjYcniYYIOqT00PAxA9",
  network: Network.MATIC_MUMBAI,
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
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [nftDataLoading, setNftDataLoading] = useState(false);
  const [raffleEndDate, setRaffleEndDate] = useState<Date | null>(null);

  const router = useRouter();

  const { address, isConnected } = useAccount();

  const alchemy = new Alchemy(settings);

  const { mutateAsync: createRaffle } = api.raffle.createRaffle.useMutation({
    onSuccess: () => {
      console.log("Success User");
    },
    onError: (err) => {
      console.log("FAILURE User", err);
    },
  });

  //allow for scrolling on the modal if necessary
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, setIsOpen]);

  async function getOwnerNfts(): Promise<OwnedNftsResponse> {
    return alchemy.nft.getNftsForOwner(address!);
  }

  async function getNftDetails() {
    try {
      setNftDataLoading(true);
      const nfts = await getOwnerNfts();
      setNfts(nfts.ownedNfts);
    } catch (error) {
      console.log(error);
    } finally {
      setNftDataLoading(false);
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

    try {
      // Call the onSubmit function with the form data
      console.log("submitting form");
      console.log(selectedNft);
      console.log(ticketSupply);
      console.log(ticketPrice);
      console.log(raffleEndDate);

      let response = await createRaffle({
        ticketSupply: ticketSupply,
        ticketPrice: ticketPrice,
        ticketsSold: 0,
        endDate: raffleEndDate!,
        nftContractAddress: selectedNft?.contract.address!,
        nftTokenId: selectedNft?.tokenId!,
        nftTokenURI: selectedNft?.rawMetadata?.image!,
        nftTokenName: selectedNft?.rawMetadata?.name!,
        nftCollectionName: selectedNft?.contract.openSea?.collectionName!,
        winnerWalletAddress: "",
        creatorWalletAddress: address!,
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
                    <div className=" flex w-full flex-col items-center rounded ">
                      <Image
                        src={selectedNft.rawMetadata?.image!}
                        alt="user NFT"
                        width={300}
                        height={300}
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

                {nftDataLoading && (
                  <div className="flex items-center justify-center">
                    <Image
                      src="/rings.svg"
                      alt="loader"
                      width={100}
                      height={100}
                    />
                  </div>
                )}

                {!isConnected && !nftDataLoading && (
                  <div className="flex items-center justify-center">
                    <p className="text-2xl">Please connect your wallet!</p>
                  </div>
                )}

                {isConnected && !nftDataLoading && nfts.length === 0 && (
                  <div className="flex items-center justify-center">
                    <p className="text-2xl">No NFTs found</p>
                  </div>
                )}

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
                              setTicketPrice(parseFloat(e.target.value));
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Raffle End Date
                        </label>

                        <div className="mt-1">
                          <DatePicker
                            selected={raffleEndDate}
                            onChange={(date: Date | null) =>
                              setRaffleEndDate(date)
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="block rounded-md border-2 border-light shadow-sm hover:border-secondary focus:border-secondary"
                          />
                        </div>
                      </div>

                      <div className="mt-6 mr-6 flex flex-row justify-end">
                        <button
                          className="relative flex flex-row items-center  justify-end rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          type="submit"
                          disabled={
                            !isConnected ||
                            !selectedNft ||
                            !ticketPrice ||
                            !ticketSupply ||
                            !raffleEndDate ||
                            raffleEndDate < new Date()
                          }
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
