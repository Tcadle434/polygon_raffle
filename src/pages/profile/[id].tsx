import React, { useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import RaffleCard from "~/components/RaffleCard";
import Link from "next/link";

const stats = [
  { name: "Total Subscribers", stat: "71,897" },
  { name: "Avg. Open Rate", stat: "58.16%" },
  { name: "Avg. Click Rate", stat: "24.57%" },
  { name: "Avg. Click Rate", stat: "24.57%" },
];

const profile = () => {
  const [selectedButton, setSelectedButton] = useState("button1");
  const router = useRouter();
  const profileWalletAddress = router.query.id as string;

  const participantResponse =
    api.participant.getParticipantByWalletAddress.useQuery(
      profileWalletAddress
    );
  const winnerResponse =
    api.raffle.getRaffleByWinnerWalletAddress.useQuery(profileWalletAddress);

  const rafflesCreated =
    api.raffle.getRaffleByCreatorWalletAddress.useQuery(profileWalletAddress);

  const raffleProfits =
    api.raffle.getRaffleWinnersTotalProfits.useQuery(profileWalletAddress);

  const rafflesForParticipant =
    api.participant.getAllRafflesByParticipantWalletAddress.useQuery(
      profileWalletAddress
    );

  const totalRaffleTicketsByCreator =
    api.participant.getTotalNumTicketsByCreatorWalletAddress.useQuery(
      profileWalletAddress
    );

  return (
    <div className="bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h1 className="mt-8 text-xl md:text-3xl">Hello,</h1>
        <h1 className=" text-sm sm:text-xl md:text-3xl">
          {profileWalletAddress}
        </h1>
        <p className="mt-16 ml-1 text-gray-500">Raffle Stats</p>
        <div className=" grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Raffles Entered
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {participantResponse.isLoading && "Loading..."}
              {participantResponse.data?.length}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Raffles Created
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {rafflesCreated.isLoading && "Loading..."}
              {rafflesCreated.data?.length}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Raffles Won
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {winnerResponse.isLoading && "Loading..."}
              {winnerResponse.data?.length}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Total Raffle Tickets Sold
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {totalRaffleTicketsByCreator.isLoading && "Loading..."}
              {totalRaffleTicketsByCreator.data?._sum.numTickets}
            </dd>
          </div>
        </div>
        <div className="mb-4 ml-1 mt-16 md:mb-0">
          <button
            type="button"
            className={`${
              selectedButton === "button1" ? "bg-secondary " : "bg-light"
            } relative mr-8 -ml-px inline-flex items-center  rounded px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            onClick={() => setSelectedButton("button1")}
            // className="relative mr-8 -ml-px inline-flex items-center  rounded bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            Raffled Entered
          </button>
          <button
            type="button"
            className={`${
              selectedButton === "button2" ? "bg-secondary " : "bg-light"
            } relative mr-8 -ml-px inline-flex items-center  rounded px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            onClick={() => setSelectedButton("button2")}
          >
            RafflesCreated
          </button>

          <ul
            role="list"
            className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {selectedButton === "button1" && (
              <>
                {!rafflesForParticipant ||
                  (rafflesForParticipant.data?.length === 0 && (
                    <div className="ml-2 pl-8 text-xl text-secondary">
                      No Entered Raffles Found
                    </div>
                  ))}
                {rafflesForParticipant.data?.map((raffle: any, index: any) => (
                  <li key={raffle.raffle.id} className="relative">
                    <Link href={`/raffles/${raffle.raffle.id}`}>
                      <RaffleCard
                        raffleId={raffle.raffle.id!}
                        imageUrl={raffle.raffle.nftTokenURI!}
                        nftName={raffle.raffle.nftTokenName!}
                        nftCollectionName={raffle.raffle.nftCollectionName!}
                        raffleEndDate={raffle.raffle.endDate!}
                        ticketPrice={raffle.raffle.ticketPrice}
                        ticketsRemaining={
                          raffle.raffle.ticketSupply - raffle.raffle.ticketsSold
                        }
                        totalTickets={raffle.raffle.ticketSupply}
                        isLast={false}
                        newLimit={() => {}}
                      />
                    </Link>
                  </li>
                ))}
              </>
            )}

            {selectedButton === "button2" && (
              <>
                {!rafflesCreated ||
                  (rafflesCreated.data?.length === 0 && (
                    <div className="ml-2 pl-8 text-xl text-secondary">
                      No Entered Raffles Found
                    </div>
                  ))}
                {rafflesCreated.data?.map((raffle: any, index: any) => (
                  <li key={raffle.id} className="relative">
                    <Link href={`/raffles/${raffle.id}`}>
                      <RaffleCard
                        raffleId={raffle.id!}
                        imageUrl={raffle.nftTokenURI!}
                        nftName={raffle.nftTokenName!}
                        nftCollectionName={raffle.nftCollectionName!}
                        raffleEndDate={raffle.endDate!}
                        ticketPrice={raffle.ticketPrice}
                        ticketsRemaining={
                          raffle.ticketSupply - raffle.ticketsSold
                        }
                        totalTickets={raffle.ticketSupply}
                        isLast={false}
                        newLimit={() => {}}
                      />
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default profile;
