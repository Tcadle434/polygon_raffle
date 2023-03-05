import React, { SetStateAction } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SuccessAlert from "~/components/SuccessAlert";
import ErrorAlert from "~/components/ErrorAlert";
import Navbar from "~/components/Navbar";
import NftUpload from "~/components/NftUpload";
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import contractAbi from "../contracts/raffle.json";

const settings = {
  apiKey: "ZuSU4sqkiZWPY9G2jJuWNSBu7WlqaVmK", // mainnet
  network: Network.MATIC_MAINNET,
  // apiKey: "HRtcdn0En4LLGdjYcniYYIOqT00PAxA9", // testnet
  // network: Network.MATIC_MUMBAI,
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
  const [isNftApproved, setIsNftApproved] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(0);
  const [publishRaffleSuccess, setPublishRaffleSuccess] = useState(0);
  const [raffleEndDate, setRaffleEndDate] = useState<Date | null>(null);
  const [raffleErrorDetails, setRaffleErrorDetails] = useState<Error | null>(
    null
  );
  const [raffleErrorDetailsTwo, setRaffleErrorDetailsTwo] =
    useState<Error | null>(null);

  const contractABI = contractAbi; // The ABI of the smart contract
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const alchemy = new Alchemy(settings);

  const ERC721ABI = [
    "function approve(address _to, uint256 _tokenId) public,",
    "function setApprovalForAll(address _to, bool _approved) public",
  ];

  // const contractAddress = "0x18bded3e3ba31f720a5a020d447afb185c6197ee"; // The address of the smart contract on mumbai
  const contractAddress = "0x4401c8DbDcd9201C48092F6fC384db0ae80BE197"; // the address of the smart contract on build bear test

  let currentKey = 0;

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

  useEffect(() => {
    if (raffleErrorDetails || raffleErrorDetailsTwo) {
      console.log("we found an error in useffect");
      setIsFormLoading(false);
    }
    if (approvalSuccess === 1 || approvalSuccess === 2) {
      setTimeout(() => {
        setApprovalSuccess(0);
      }, 5000);
    }
  }, [raffleErrorDetails, raffleErrorDetailsTwo, approvalSuccess]);

  async function getOwnerNfts(): Promise<OwnedNftsResponse> {
    return alchemy.nft.getNftsForOwner(address!);
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

  const triggerModal = () => {
    setIsOpen(true);
    getNftDetails();
  };

  const handleNftSelect = (nft: OwnedNft) => {
    setSelectedNft(nft);
    console.log(nft);
    const approvalResponse = approveNftForTransfer(
      nft?.contract.address!,
      nft?.tokenId!
    );
    console.log(approvalResponse);
    setIsOpen(false);
  };

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

        const tx = await contract.approve(contractAddress, nftTokenId, {
          gasLimit: 10000000,
        });
        // const tx = await contract.setApprovalForAll(contractAddress, true, {
        //   gasLimit: 10000000,
        // });

        let res = await tx.wait();

        if (res?.err) {
          console.log("error, ", res);
          setApprovalSuccess(2);
        } else {
          console.log("success", res);
          setApprovalSuccess(1);
        }

        console.log(
          `Mined, see transaction: https://explorer.dev.buildbear.io/Cooing_Zam_Wesell_8ec808a5/tx/${tx.hash}`
        );
      } catch (error: unknown) {
        console.log("entered catch block");
        setRaffleErrorDetails(error as SetStateAction<Error | null>);
        setApprovalSuccess(2);
        console.log(error);
      } finally {
        setIsNftApproved(false);
      }
    }
  };

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
          contractAddress,
          contractABI,
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
          new Date(raffleEndDate!).getTime(),
          { gasLimit: 10000000 }
        );

        let res = await tx.wait();
        console.log("res", res);

        const receipt = await provider.getTransactionReceipt(tx.hash);
        console.log("unfilteredLogs", receipt.logs);
        const logs = receipt.logs.filter(
          (log) =>
            log.topics[0] === contract.interface.getEventTopic("RaffleCreated")
        );
        const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
        const contractRaffleId = parsedLogs[0]?.args.raffleId._hex;

        if (res?.err) {
          console.log("error, ", res);
          setPublishRaffleSuccess(2);
        } else {
          console.log("success", res);
          //write the raffle object to the DB
          let response = await createRaffle({
            ticketSupply: ticketSupply,
            ticketPrice: ticketPrice,
            ticketsSold: 0,
            endDate: raffleEndDate!,
            nftContractAddress: selectedNft?.contract.address!,
            nftTokenId: selectedNft?.tokenId!,
            nftTokenURI:
              selectedNft?.rawMetadata?.image! ||
              selectedNft?.rawMetadata?.image_url!,
            nftTokenName: selectedNft?.rawMetadata?.name!,
            nftCollectionName: selectedNft?.contract.openSea?.collectionName!,
            contractRaffleId: contractRaffleId,
            winnerWalletAddress: "",
            creatorWalletAddress: address!,
          });

          console.log(
            "here is the response from creating the raffle in the backend DB: ",
            response
          );
          setPublishRaffleSuccess(1);
        }

        console.log(
          `Mined, see transaction: https://rpc.buildbear.io/Cautious_Jar_Jar_Binks_e940c24d/tx/${tx.hash}`
        );
      } else {
        console.error("wallet is not installed");
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

  return (
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
                    <div className=" flex w-full flex-col items-center rounded ">
                      <Image
                        src={
                          selectedNft.rawMetadata?.image! ||
                          selectedNft.rawMetadata?.image_url!
                        }
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
                    <React.Fragment key={currentKey++}>
                      {nft.rawMetadata &&
                        (nft.rawMetadata.image || nft.rawMetadata.image_url) &&
                        !nft.spamInfo?.isSpam && (
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
                                  src={
                                    (
                                      nft.rawMetadata?.image ||
                                      nft.rawMetadata?.image_url
                                    ).startsWith("ipfs://")
                                      ? `https://ipfs.io/${
                                          nft.rawMetadata?.image ||
                                          nft.rawMetadata?.image_url
                                        }`
                                      : `${
                                          nft.rawMetadata?.image ||
                                          nft.rawMetadata?.image_url
                                        }`
                                  }
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
                          {ticketSupply && ticketPrice && ticketSupply !== 0 ? (
                            <div className="mt-1">
                              <p className="my-2 block truncate pl-2 text-left text-xs font-medium text-gray-500">
                                Raffle sellout value:{" "}
                                {ticketSupply * ticketPrice} $MATIC
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
  );
};

export default create;
