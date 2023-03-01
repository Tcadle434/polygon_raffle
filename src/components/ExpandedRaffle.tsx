import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import z from "zod";
import { useRouter } from "next/router";
import Timer from "countdown";
import Countdown from "react-countdown";
import moment from "moment";
import CountdownTimer from "./CountdownTimer";

import { api } from "~/utils/api";
import Divider from "./Divider";
import useWalletStore, { getWalletAddress } from "~/store/useWalletStore";

import ParticipantList from "./ParticipantList";
import { end } from "cheerio/lib/api/traversing";

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
  creatorWalletAddress: z.string(),
  createdAt: z.date(),
  raffleID: z.string(),
});

type RaffleProps = z.infer<typeof raffleSchema>;

interface Participants {
  walletAddress: string;
  ticketsBought: number;
}

interface ListProps {
  items: Participants[];
}

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
  creatorWalletAddress,
  createdAt,
  raffleID,
}) => {
  const [ticketNum, setTicketNum] = useState(1);
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const walletAddress = useWalletStore((state) => state.walletAddress);
  const allParticipantsForRaffle =
    api.participant.getParticipantsByRaffleId.useQuery(raffleID);
  const totalTicketsSold =
    api.participant.getTotalNumTicketsByRaffleId.useQuery(raffleID);

  const router = useRouter();

  const { mutateAsync: buyTickets } = api.participant.buyTickets.useMutation({
    onSuccess: () => {
      console.log("Success User");
    },
    onError: (err) => {
      console.log("FAILURE User", err);
    },
  });

  const handleBuyTickets = async () => {
    console.log(`Buying ${ticketNum} tickets...`);
    try {
      let response = await buyTickets({
        numTickets: ticketNum,
        buyerWalletAddress: walletAddress!,
        raffleId: raffleID,
      });
      //   let response2 = await updateTicketsSold({
      //     id: raffleID,
      //     ticketsSold: ticketNum,
      //   });
      console.log("here is the response from buying the tickets: ", response);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        // setIsFormLoading(false);
        router.push("/");
      }, 3000);
    }
  };

  //grab the connected wallet from the zustand store if it exists
  useEffect(() => {
    console.log("wallet address changed");
    console.log();
    getWalletAddress();
  }, []);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h1 className=" mt-8 text-4xl">Raffle Details</h1>
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
                    className="ml-8 inline-flex w-full items-center justify-center rounded-lg bg-third px-3 py-3 text-center text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-green-300"
                    onClick={() => handleBuyTickets()}
                  >
                    <h3 className="text-xl font-bold">Buy Tickets</h3>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4 rounded border lg:col-span-2">
            <section aria-labelledby="section-2-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h5 className="text-md font-medium text-gray-500">
                    {nftCollectionName}
                  </h5>
                  <h2
                    id="section-2-title"
                    className="text-3xl font-medium text-gray-900"
                  >
                    {nftTokenName}
                  </h2>
                  <div className="mt-8" />
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
                          {totalTicketsSold.isLoading && <div>Loading...</div>}
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
                        allParticipantsForRaffle.data!.map((participant) => (
                          <div className="mb-4 flex flex-row justify-between">
                            <p className="mb-3 block truncate font-normal text-gray-500 sm:inline-block sm:overflow-visible ">
                              {participant.walletAddress}
                            </p>
                            <p className="mb-3 font-normal text-gray-500">
                              {participant.numTickets}
                            </p>
                          </div>
                        ))}
                      {/* <ParticipantList /> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedRaffle;
