import React, { SetStateAction, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { useAccount, useBalance } from "wagmi";
import { BigNumber, ethers } from "ethers";
import z from "zod";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

import { api } from "~/utils/api";
import CountdownTimer from "./CountdownTimer";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import Divider from "./Divider";

import contractAbi from "../contracts/raffle.json";
import {
  CONTRACT_ADDRESS,
  BASE_EXPLORER_URL,
  BASE_ME_COLLECTION_URL,
} from "~/lib/constants";
import { verified } from "~/lib/verified";

const raffleSchema = z.object({
  ticketSupply: z.number(),
  ticketPrice: z.number(),
  ticketsSold: z.number(),
  endDate: z.date(),
  nftContractAddress: z.string(),
  nftTokenId: z.string(),
  nftTokenURI: z.string().nullish(),
  nftTokenName: z.string().nullish(),
  nftCollectionName: z.string().nullish(),
  winnerWalletAddress: z.string().nullish(),
  winnerPicked: z.boolean(),
  creatorWalletAddress: z.string(),
  createdAt: z.date(),
  raffleID: z.string(),
  contractRaffleId: z.string(),
});

type RaffleProps = z.infer<typeof raffleSchema>;

const ExpandedRaffle: NextPage<RaffleProps> = ({
  ticketSupply,
  ticketPrice,
  ticketsSold,
  endDate,
  nftContractAddress,
  nftTokenId,
  nftTokenURI,
  nftTokenName,
  nftCollectionName,
  winnerWalletAddress,
  winnerPicked,
  creatorWalletAddress,
  createdAt,
  raffleID,
  contractRaffleId,
}) => {
  const [ticketNum, setTicketNum] = useState(1);
  const [buySuccess, setBuySuccess] = useState(0);
  const [winnerPickedSuccess, setWinnerPickedSuccess] = useState(0);
  const [winnerSelectLoading, setWinnerSelectLoading] = useState(false);
  const [buyTicketsLoading, setBuyTicketsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [enoughFunds, setEnoughFunds] = useState(true);
  const [raffleErrorDetails, setRaffleErrorDetails] = useState<Error | null>(
    null
  );

  const router = useRouter();
  const { address, isConnected } = useAccount();
  const balance = useBalance({ address: address });

  const allParticipantsForRaffle =
    api.participant.getParticipantsByRaffleId.useQuery(raffleID);
  const totalTicketsSold =
    api.participant.getTotalNumTicketsByRaffleId.useQuery(raffleID);

  const { mutateAsync: buyTickets } = api.participant.buyTickets.useMutation({
    onSuccess: () => {
      console.log("Successfully bought tickets");
    },
    onError: (err) => {
      console.log("Failed to buy tickets: ", err);
    },
  });

  const { mutateAsync: updateRaffleWinnerPickedWithWinnerWalletAddress } =
    api.raffle.updateRaffleWinnerPickedWithWinnerWalletAddress.useMutation({
      onSuccess: () => {
        console.log("Successfully updated with winner wallet address");
      },
      onError: (err) => {
        console.log("Failed to update with winner wallet address: ", err);
      },
    });

  /**
   * Handler to purchase the tickets for the raffle. This function will
   * communicate with the smart contract to purchase the tickets via the
   * buyEntry function. It will then update the database with the new
   * ticket purchases upon success via the buyTickets tRPC call.
   */
  const handleBuyTickets = async () => {
    setBuyTicketsLoading(true);
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

        const tx = await contract.buyEntry(contractRaffleId, ticketNum, {
          value: ethers.utils.parseUnits(
            (ticketNum * ticketPrice).toFixed(3),
            18
          ),
          gasLimit: 500000,
        });
        let res = await tx.wait();

        if (res?.err) {
          setBuySuccess(2);
        } else {
          setBuySuccess(1);
          await buyTickets({
            numTickets: ticketNum,
            buyerWalletAddress: address!,
            raffleId: raffleID,
          });
        }

        console.log(`See Transaction: ${BASE_EXPLORER_URL}/tx/${tx.hash}`);
      } else {
        alert("Please install MetaMask or a different Ethereum wallet.");
      }
    } catch (error: unknown) {
      setRaffleErrorDetails(error as SetStateAction<Error | null>);
      setBuySuccess(2);
    } finally {
      setTimeout(() => {
        setBuyTicketsLoading(false);
        router.reload();
      }, 3000);
    }
  };

  /**
   * Handler to pick the winner for the raffle. This function will
   * communicate with the smart contract to pick the winner via the
   * setWinner function. It will then update the database with the new
   * winner wallet address upon success via the
   * updateRaffleWinnerPickedWithWinnerWalletAddress tRPC call.
   */
  const handleWinnerPicked = async () => {
    setWinnerSelectLoading(true);
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
        const raffleEndedTopic =
          contract.interface.getEventTopic("RaffleEnded");

        console.log("before raffleStatus");

        const raffleStatus = await contract.getRaffleStatus(contractRaffleId);
        console.log("raffleStatus: ", raffleStatus);

        let res: any;
        let tx: any;

        if (raffleStatus === 4) {
          tx = await contract.getRandomNumberEmergency(contractRaffleId, {
            gasLimit: 1000000,
          });
          res = await tx.wait();
          console.log("res: ", res);
        } else {
          tx = await contract.setWinner(contractRaffleId, {
            gasLimit: 1000000,
          });
          res = await tx.wait();
          console.log("res: ", res);
        }

        async function fetchPastLogs(
          attempts: number,
          delay: number
        ): Promise<string | null> {
          for (let i = 0; i < attempts; i++) {
            if (i > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }

            const pastLogs = await provider.getLogs({
              fromBlock: res.blockNumber,
              toBlock: "latest",
              topics: [raffleEndedTopic],
            });

            for (const log of pastLogs) {
              const parsedLog = contract.interface.parseLog(log);
              if (
                BigNumber.from(parsedLog.args.raffleId).eq(contractRaffleId)
              ) {
                const raffleWinnerAddress = parsedLog.args.winner;
                return raffleWinnerAddress;
              }
            }

            console.log(
              `Attempt ${i + 1} failed. Please be patient :). Retrying in ${
                delay / 1000
              } seconds...`
            );
          }

          return null;
        }

        const raffleWinnerAddress = await fetchPastLogs(10, 30000); // Retry up to 6 times with a 30 second delay between attempts

        if (res?.err || !raffleWinnerAddress || tx?.err) {
          console.log("error, ", res);
          setWinnerPickedSuccess(2);
        } else {
          console.log("success", res);
          setWinnerPickedSuccess(1);
          await updateRaffleWinnerPickedWithWinnerWalletAddress({
            raffleId: raffleID,
            winnerWalletAddress: raffleWinnerAddress,
          });
        }
        console.log(`See Transaction: ${BASE_EXPLORER_URL}/tx/${tx.hash}`);
      } else {
        alert("Please install MetaMask or a different Ethereum wallet.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setWinnerSelectLoading(false);
        router.reload();
      }, 3000);
    }
  };

  /**
   * useEffect to check if the user has enough funds to purchase the
   * amount of tickets they are trying to purchase. If they do not have
   * enough funds, the buy tickets button will be disabled.
   */
  useEffect(() => {
    if (
      balance.isFetched &&
      ticketNum * ticketPrice >
        parseFloat(balance.data?.value.toBigInt()!.toString()!) /
          1000000000000000000
    ) {
      setEnoughFunds(false);
    } else {
      setEnoughFunds(true);
    }
  }, [ticketNum, balance]);

  /**
   * useEffect to check for errors and update state variables accordingly.
   * This is used to display error messages to the user.
   */
  useEffect(() => {
    if (raffleErrorDetails) {
      console.log("we found an error in useffect");
      setBuyTicketsLoading(false);
    }
    if (
      buySuccess === 1 ||
      buySuccess === 2 ||
      winnerPickedSuccess === 1 ||
      winnerPickedSuccess === 2
    ) {
      setTimeout(() => {
        setBuySuccess(0);
        setWinnerPickedSuccess(0);
      }, 5000);
    }
  }, [raffleErrorDetails, buySuccess]);

  /**
   * useEffect to check if the nftContractAddress is a part of the verified
   * contracts list. If it is, we will set isVerified to true.
   */
  useEffect(() => {
    if (
      verified.some(
        (address) => address.toLowerCase() === nftContractAddress.toLowerCase()
      )
    ) {
      setIsVerified(true);
    }
  }, [nftContractAddress]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h1 className="mt-8 font-mono text-4xl text-light">Raffle Details</h1>
        {/* Main 3 column grid */}
        <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-4 rounded ">
            <section aria-labelledby="section-1-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <div className=" flex w-full flex-col items-center rounded ">
                    <Image
                      src={nftTokenURI!}
                      alt="user NFT"
                      width={300}
                      height={300}
                      className="items-center"
                    />
                  </div>
                </div>
              </div>
              {!winnerPicked && endDate! > new Date() && (
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex w-full flex-row justify-between">
                    <div>
                      <input
                        type="number"
                        name="tickets"
                        id="tickets"
                        className="block h-16 w-16 rounded-md border-2 border-secondary text-center text-xl shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        defaultValue={1}
                        min={1}
                        onChange={(e) => setTicketNum(parseInt(e.target.value))}
                      />
                    </div>
                    <button
                      className="ml-8 inline-flex w-full items-center justify-center rounded-lg bg-light px-3 py-3 text-center text-white hover:bg-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handleBuyTickets()}
                      disabled={
                        buyTicketsLoading ||
                        !isConnected ||
                        !enoughFunds ||
                        address === creatorWalletAddress ||
                        ticketNum >
                          ticketSupply -
                            totalTicketsSold.data?._sum.numTickets! ||
                        ticketSupply -
                          totalTicketsSold.data?._sum.numTickets! <=
                          0 ||
                        endDate! < new Date()
                      }
                    >
                      <h3 className="text-xl font-bold">Buy Tickets</h3>
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col ">
                    <h3 className="text-md mb-4 font-mono font-bold text-light">
                      Buying {ticketNum} ticket(s)
                    </h3>
                    <h3 className="text-md mb-4 font-mono font-bold text-light">
                      Total Cost:{" "}
                      {Math.round(ticketNum * ticketPrice * 1000) / 1000} $MATIC
                    </h3>
                  </div>
                </div>
              )}

              {!winnerPicked && endDate! < new Date() && (
                <div className="mt-4 flex flex-col items-center">
                  <div className="items-center">
                    <div>
                      <h3 className="text-md mb-4 font-mono font-bold text-light">
                        Raffle Pending...
                      </h3>
                      <button
                        className="relative mr-8 -ml-px inline-flex items-center  rounded bg-light px-4 py-2 text-sm font-medium text-white hover:bg-pink-200 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 "
                        onClick={() => handleWinnerPicked()}
                        disabled={winnerSelectLoading || !isConnected}
                      >
                        <h3 className="text-xl font-bold">Pick Winner</h3>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {winnerPicked && (
                <div className="mt-4 flex flex-col items-center">
                  <div className="items-center">
                    <h3 className="font-mono text-xl font-bold text-light">
                      Winner:
                    </h3>
                    <p className="text-md font-mono font-bold text-light">
                      {winnerWalletAddress}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4 rounded  lg:col-span-2">
            <section aria-labelledby="section-2-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <div className="flex flex-row items-center">
                    <h5 className="text-md mr-1 font-medium text-gray-500">
                      {nftCollectionName}{" "}
                    </h5>
                    <div>
                      {isVerified ? (
                        <button title="The Raffi3 team has marked this as a verified collection">
                          <CheckBadgeIcon width={25} color="#8FFFE6" />
                        </button>
                      ) : (
                        <button title="This collection has not been verfified by the Raffi3 team. Be careful! Please reach out to get the collection added if it is legitimate">
                          <ExclamationTriangleIcon width={25} color="#F6BE00" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h2
                    id="section-2-title"
                    className="text-3xl font-medium text-gray-900"
                  >
                    {nftTokenName}
                  </h2>
                  <div className="flex flex-col">
                    <p className="text-md mt-1 block truncate font-normal text-gray-500 sm:inline-block sm:overflow-visible">
                      NFT Contract Address: {nftContractAddress}
                    </p>
                    <p className="text-md mt-1 block truncate font-normal text-gray-500 sm:inline-block sm:overflow-visible">
                      NFT Token ID: {nftTokenId}
                    </p>
                    <div className="flex flex-row">
                      <a
                        href={`${BASE_ME_COLLECTION_URL}/${nftContractAddress}`}
                      >
                        <Image
                          src="/me_poly_logo.jpeg"
                          alt="Magic Eden logo"
                          height={40}
                          width={40}
                          className="mt-2 mr-4 rounded"
                        />
                      </a>
                      <a
                        href={`${BASE_EXPLORER_URL}/address/${nftContractAddress}`}
                      >
                        <Image
                          src="/polyscan.png"
                          alt="Magic Eden logo"
                          height={40}
                          width={40}
                          className="mt-2 rounded"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="mt-8" />

                  {winnerSelectLoading && (
                    <div className="mt-8 flex flex-col items-center justify-center">
                      <Image
                        src="/bars.svg"
                        alt="form loader"
                        height={50}
                        width={50}
                      />
                      <p className=" mt-6 text-sm text-secondary">
                        PLEASE DO NOT REFRESH while we pick a winner! It's
                        usually quick, but this may take up to 5 minutes.
                      </p>
                    </div>
                  )}

                  {buyTicketsLoading && (
                    <div className="mt-8 flex flex-col items-center justify-center">
                      <Image
                        src="/bars.svg"
                        alt="form loader"
                        height={50}
                        width={50}
                      />
                      <p className=" mt-6 text-sm text-secondary">
                        PLEASE DO NOT REFRESH while we purchase your tickets!
                      </p>
                    </div>
                  )}

                  {!winnerSelectLoading && !buyTicketsLoading && (
                    <>
                      <Divider labelText="Details" />
                      <div className="mt-8">
                        <div className="mb-8 grid grid-cols-1 gap-3 gap-y-6 font-bold md:grid-cols-2">
                          <div className="flex flex-col ">
                            <label className="text-md text-secondary line-clamp-1">
                              Ticket Price
                            </label>
                            <p className="mb-3 font-normal text-gray-500">
                              {ticketPrice} MATIC
                            </p>
                          </div>

                          <div className="flex flex-col ">
                            <label className="text-md text-secondary line-clamp-1">
                              Tickets Remaining
                            </label>
                            <p className="mb-3 font-normal text-gray-500">
                              {totalTicketsSold.isLoading && (
                                <div>Loading...</div>
                              )}
                              {totalTicketsSold.data && (
                                <div>
                                  {ticketSupply -
                                    totalTicketsSold.data._sum.numTickets!}{" "}
                                  / {ticketSupply}
                                </div>
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col ">
                            <label className="text-md text-secondary line-clamp-1">
                              Raffle Start Date
                            </label>
                            <p className="mb-3 font-normal text-gray-500">
                              {createdAt.toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex flex-col ">
                            <label className="text-md text-secondary line-clamp-1">
                              Time Remaining
                            </label>
                            <p className="mb-3 font-normal text-gray-500">
                              <CountdownTimer futureDate={endDate} />
                            </p>
                          </div>

                          <div className="flex flex-col ">
                            <label className="text-md text-secondary line-clamp-1">
                              Raffler Address
                            </label>
                            <p className="mb-3 block truncate font-normal text-gray-500 sm:inline-block sm:overflow-visible ">
                              {creatorWalletAddress}
                            </p>
                          </div>
                        </div>
                        <Divider labelText="Participants" />
                        <div className="mt-8">
                          <div className="mb-4 flex flex-row justify-between">
                            <label className="text-md font-bold text-secondary line-clamp-1">
                              Address
                            </label>
                            <label className="text-md font-bold text-secondary line-clamp-1">
                              Tickets Purchased
                            </label>
                          </div>
                          {/* map through allParticipantsForRaffle and list out some data */}
                          {allParticipantsForRaffle.isLoading && (
                            <div>Loading...</div>
                          )}
                          {allParticipantsForRaffle.data &&
                            allParticipantsForRaffle.data!.map(
                              (participant) => (
                                <div className="mb-4 flex flex-row justify-between">
                                  <p className="mb-3 block truncate font-normal text-gray-500 sm:inline-block sm:overflow-visible ">
                                    {participant.walletAddress}
                                  </p>
                                  <p className="mb-3 font-normal text-gray-500">
                                    {participant.numTickets}
                                  </p>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {buySuccess === 1 && (
                <SuccessAlert successMessage="Your Raffle tickets have been purchased!" />
              )}
              {buySuccess === 2 && (
                <ErrorAlert errorMessage="Failed to purchase tickets, please try again" />
              )}
              {winnerPickedSuccess === 1 && (
                <SuccessAlert successMessage="Raffle winner has been selected!" />
              )}
              {winnerPickedSuccess === 2 && (
                <ErrorAlert errorMessage="Failed to pick a winner, please try again" />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedRaffle;
