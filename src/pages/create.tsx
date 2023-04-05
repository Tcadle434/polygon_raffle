import React, { SetStateAction } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../utils/api";

import SuccessAlert from "~/components/SuccessAlert";
import ErrorAlert from "~/components/ErrorAlert";
import Navbar from "~/components/Navbar";
import NftUpload from "~/components/NftUpload";
import SmallRaffleCard from "~/components/SmallRaffleCard";
import Footer from "~/components/Footer";

import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import contractAbi from "../contracts/raffle.json";
import { API_KEY, CONTRACT_ADDRESS, BASE_EXPLORER_URL } from "~/lib/constants";
import { verified } from "~/lib/verified";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

const settings = {
  apiKey: API_KEY,
  network: Network.MATIC_MAINNET,
};

interface Props {
  formId: string;
  loaderId: string;
  onSubmit: (formData: FormData) => Promise<any>;
}

const create: React.FC<Props> = ({ formId, loaderId }) => {
  const [ticketSupply, setTicketSupply] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [approvalSuccess, setApprovalSuccess] = useState(0);
  const [publishRaffleSuccess, setPublishRaffleSuccess] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [nftDataLoading, setNftDataLoading] = useState(false);
  const [isNftApproved, setIsNftApproved] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [selectedNft, setSelectedNft] = useState<OwnedNft>();
  const [raffleEndDate, setRaffleEndDate] = useState<Date | null>(null);
  const [raffleErrorDetails, setRaffleErrorDetails] = useState<Error | null>(
    null
  );
  const [raffleErrorDetailsTwo, setRaffleErrorDetailsTwo] =
    useState<Error | null>(null);

  const { address, isConnected } = useAccount();
  const router = useRouter();
  const alchemy = new Alchemy(settings);
  let currentKey = 0;

  const ERC721ABI = [
    "function approve(address _to, uint256 _tokenId) public,",
    "function setApprovalForAll(address _to, bool _approved) public",
  ];

  const { mutateAsync: createRaffle } = api.raffle.createRaffle.useMutation({
    onSuccess: () => {
      console.log("Success creating raffle");
    },
    onError: (err) => {
      console.log("Failed to create the raffle: ", err);
    },
  });

  async function getOwnerNfts(): Promise<OwnedNftsResponse> {
    return alchemy.nft.getNftsForOwner(address!);
  }

  async function getNftDetails() {
    try {
      setNftDataLoading(true);
      const nfts = await getOwnerNfts();
      console.log(nfts);
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
    const approvalResponse = approveNftForTransfer(
      nft?.contract.address!,
      nft?.tokenId!
    );
    console.log(approvalResponse);
    setIsOpen(false);
  };

  /**
   * function to approve NFT for transfer out of user's wallet
   * and to the raffle contract. This is the first of two transactions
   * that need to be completed in order to create a raffle.
   * @param {string} nftContractAddress - address of the conract for the specific NFT
   * @param {string} nftTokenId - Token ID of the specific NFT
   */
  const approveNftForTransfer = async (
    nftContractAddress: string,
    nftTokenId: string
  ) => {
    if (window.ethereum) {
      try {
        setIsNftApproved(true);

        const provider = new ethers.providers.Web3Provider(
          window.ethereum as ethers.providers.ExternalProvider
        );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          nftContractAddress,
          ERC721ABI,
          signer
        );

        const tx = await contract.approve(CONTRACT_ADDRESS, nftTokenId, {
          gasLimit: 500000,
        });
        let res = await tx.wait();

        if (res?.err) {
          setApprovalSuccess(2);
        } else {
          setApprovalSuccess(1);
        }

        console.log(`See Transaction: ${BASE_EXPLORER_URL}/tx/${tx.hash}`);
      } catch (error: unknown) {
        setRaffleErrorDetails(error as SetStateAction<Error | null>);
        setApprovalSuccess(2);
        console.log(error);
      } finally {
        setIsNftApproved(false);
      }
    }
  };

  /**
   * handler for the form submit event. This is the second of two transactions
   * that need to be completed in order to create a raffle. This function
   * will communicate with the smart contract to create the raffle via the
   * createRaffle function. Upon success, it will write the raffle data to the
   * database via the createRaffle tRPC endpoint.
   * @param {React.FormEvent<HTMLFormElement>} e - form submit event
   */
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as ethers.providers.ExternalProvider
        );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi,
          signer
        );

        const priceStructure = {
          id: 0,
          numEntries: ticketSupply,
          price: ethers.utils.parseUnits(ticketPrice.toString(), 18),
        };

        const tx = await contract.createRaffle(
          ticketSupply,
          selectedNft?.contract.address!,
          selectedNft?.tokenId!,
          ethers.utils.parseUnits(ticketPrice.toString(), 18),
          [priceStructure],
          address,
          Math.floor(raffleEndDate!.getTime() / 1000),
          { gasLimit: 500000 }
        );

        let res = await tx.wait();

        const receipt = await provider.getTransactionReceipt(tx.hash);
        const logs = receipt.logs.filter(
          (log) =>
            log.topics[0] === contract.interface.getEventTopic("RaffleCreated")
        );
        const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
        const contractRaffleId = parsedLogs[0]?.args.raffleId._hex;

        if (res?.err || !contractRaffleId) {
          setPublishRaffleSuccess(2);
        } else {
          await createRaffle({
            ticketSupply: ticketSupply,
            ticketPrice: ticketPrice,
            ticketsSold: 0,
            endDate: raffleEndDate!,
            nftContractAddress: selectedNft?.contract.address!,
            nftTokenId: selectedNft?.tokenId!,
            nftTokenURI: selectedNft?.media[0]?.gateway,
            nftTokenName: selectedNft?.rawMetadata?.name!,
            nftCollectionName:
              selectedNft?.contract.name! ||
              selectedNft?.contract.openSea?.collectionName!,
            contractRaffleId: contractRaffleId,
            winnerWalletAddress: "",
            creatorWalletAddress: address!,
          });
          setPublishRaffleSuccess(1);
        }

        console.log(`See Transaction: ${BASE_EXPLORER_URL}/tx/${tx.hash}`);
      } else {
        console.error("Please install Metamask or another Ethereum wallet.");
      }
    } catch (error: unknown) {
      setRaffleErrorDetailsTwo(error as SetStateAction<Error | null>);
      setPublishRaffleSuccess(2);
      console.log(error);
    } finally {
      !raffleErrorDetails &&
        !raffleErrorDetailsTwo &&
        setTimeout(() => {
          setIsFormLoading(false);
          router.push("/");
        }, 3000);
    }
  };

  /**
   * useEffect to allow for scrolling when the modal is
   * open if there are excess nfts to scroll through.
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, setIsOpen]);

  /**
   * useEffect to check for errors and update state variables accordingly.
   * This is used to display error messages to the user.
   */
  useEffect(() => {
    if (raffleErrorDetails || raffleErrorDetailsTwo) {
      setIsFormLoading(false);
    }
    if (approvalSuccess === 1 || approvalSuccess === 2) {
      setTimeout(() => {
        setApprovalSuccess(0);
      }, 5000);
    }
  }, [raffleErrorDetails, raffleErrorDetailsTwo, approvalSuccess]);

  /**
   * useEffect to check if the nftContractAddress is a part of the verified
   * contracts list. If it is, we will set isVerified to true.
   */
  useEffect(() => {
    if (
      verified.some(
        (address) =>
          address.toLowerCase() === selectedNft?.contract.address.toLowerCase()
      )
    ) {
      setIsVerified(true);
    }
  }, [selectedNft, verified]);

  return (
    <>
      <div className="min-h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-[#59368B] to-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <h1 className="mt-8 font-mono text-4xl text-light">
            Create a new Raffle
          </h1>
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
                      <>
                        <div className=" flex w-full flex-col items-center rounded ">
                          <Image
                            src={selectedNft.media[0]?.gateway!}
                            alt="user NFT"
                            width={300}
                            height={300}
                            className="items-center"
                          />
                        </div>
                        <div className="mt-4">
                          <div className="flex flex-row items-center">
                            <p className="mr-1 text-2xl font-bold tracking-tight text-secondary line-clamp-1">
                              {selectedNft.contract.name ||
                                selectedNft.contract.openSea?.collectionName!}
                            </p>
                            {isVerified ? (
                              <button title="The Raffi3 team has marked this as a verified collection">
                                <CheckBadgeIcon width={25} color="#8FFFE6" />
                              </button>
                            ) : (
                              <button title="This collection has not been verfified by the Raffi3 team. Be careful! Please reach out to get the collection added if it is legitimate">
                                <ExclamationTriangleIcon
                                  width={25}
                                  color="#F6BE00"
                                />
                              </button>
                            )}
                          </div>
                          <p className="font-medium tracking-tight text-black line-clamp-1">
                            {selectedNft.rawMetadata?.name}
                          </p>
                        </div>
                      </>
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
                    className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                  >
                    {nfts.map((nft) => (
                      <React.Fragment key={currentKey++}>
                        {nft.rawMetadata &&
                          nft.media[0]?.gateway &&
                          !nft.spamInfo?.isSpam && (
                            <div key={nft.tokenId}>
                              <button
                                className="inline-block w-[200px] "
                                onClick={() => handleNftSelect(nft)}
                              >
                                <SmallRaffleCard
                                  imageUrl={nft.media[0]?.gateway!}
                                  nftName={nft.rawMetadata?.name!}
                                  nftCollectionName={
                                    nft.contract.name! ||
                                    nft.contract.openSea?.collectionName!
                                  }
                                  nftContractAddress={nft.contract.address!}
                                />
                              </button>
                            </div>
                          )}
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Right column */}
            <div className="grid grid-cols-1 gap-4 rounded  lg:col-span-2">
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

                    {isFormLoading || isNftApproved ? (
                      <div
                        id={loaderId}
                        className="mt-8 flex flex-col items-center justify-center"
                      >
                        <Image
                          src="/bars.svg"
                          alt="form loader"
                          height={50}
                          width={50}
                        />
                        <p className=" mt-6 text-sm text-secondary">
                          PLEASE DO NOT REFRESH OR CLICK AWAY FROM THIS SCREEN.
                          YOUR RAFFLE DATA COULD BE LOST. Please be patient!
                        </p>
                      </div>
                    ) : (
                      <>
                        <form
                          method="POST"
                          onSubmit={handleFormSubmit}
                          id={formId}
                        >
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
                            <p className="my-2 block truncate pl-2 text-left text-xs font-medium text-gray-500">
                              Ticket supply must be a whole number
                            </p>
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
                                  setTicketPrice(
                                    Number(
                                      parseFloat(e.target.value).toFixed(3)
                                    )
                                  );
                                }}
                              />
                            </div>
                            {ticketSupply &&
                            ticketPrice &&
                            ticketSupply !== 0 ? (
                              <div className="mt-1">
                                <p className="my-2 block truncate pl-2 text-left text-xs font-medium text-gray-500">
                                  Raffle sellout value:{" "}
                                  {Math.round(
                                    ticketSupply * ticketPrice * 1000
                                  ) / 1000}{" "}
                                  $MATIC
                                </p>
                              </div>
                            ) : (
                              <p className="my-2 block truncate pl-2 text-left text-xs font-medium text-gray-500">
                                Raffle sellout value: 0 $MATIC
                              </p>
                            )}
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
                            <p className="my-2 block truncate pl-2 text-left text-xs font-medium text-gray-500">
                              Raffles must be at least 24h long
                            </p>
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
                                raffleEndDate < new Date() ||
                                raffleEndDate.getTime() - new Date().getTime() <
                                  86400000
                              }
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
                {approvalSuccess === 1 && (
                  <SuccessAlert successMessage="NFT approved to transfer! Fill out the raffle parameters to raffle your NFT" />
                )}
                {approvalSuccess === 2 && (
                  <ErrorAlert errorMessage="NFT not approved to transfer! If you are sure it is ERC721,Please refresh and try again" />
                )}
                {publishRaffleSuccess === 1 && (
                  <SuccessAlert successMessage="Raffle created! You can view it on the home page" />
                )}
                {publishRaffleSuccess === 2 && (
                  <ErrorAlert errorMessage="Raffle not created! Please try again" />
                )}
                {raffleErrorDetails && (
                  <ErrorAlert
                    errorMessage={`Error creating raffle ${raffleErrorDetails!.message.toString()}`}
                  />
                )}
                {raffleErrorDetailsTwo && (
                  <ErrorAlert
                    errorMessage={`Error creating raffle ${raffleErrorDetailsTwo!.message.toString()}`}
                  />
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default create;
