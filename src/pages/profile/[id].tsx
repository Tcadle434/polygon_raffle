import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import RaffleCard from "~/components/RaffleCard";

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

  const rafflesForParticipant =
    api.participant.getAllRafflesByParticipantWalletAddress.useQuery(
      profileWalletAddress
    );

  const totalRaffleTicketsByCreator =
    api.participant.getTotalNumTicketsByCreatorWalletAddress.useQuery(
      profileWalletAddress
    );

  return (
    <>
      <div className="min-h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-[#59368B] to-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <h1 className="mt-8 font-mono text-xl text-white md:text-3xl">
            Hello,
          </h1>
          <h1 className=" font-mono text-sm text-light sm:text-xl md:text-3xl">
            {profileWalletAddress}
          </h1>
          <p className="mt-16 ml-1 text-light">Raffle Stats</p>
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
                {totalRaffleTicketsByCreator.data?._sum.numTickets || 0}
              </dd>
            </div>
          </div>
          <div className="mb-4 ml-1 mt-16 md:mb-0">
            <button
              type="button"
              className={`${
                selectedButton === "button1" ? "bg-light " : "bg-transparent"
              } relative mr-8 -ml-px inline-flex items-center  rounded px-4 py-2 text-sm font-medium text-white hover:bg-light focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500`}
              onClick={() => setSelectedButton("button1")}
            >
              Raffled Entered
            </button>
            <button
              type="button"
              className={`${
                selectedButton === "button2" ? "bg-light " : "bg-transparent"
              } relative mr-8 -ml-px inline-flex items-center  rounded px-4 py-2 text-sm font-medium text-white hover:bg-light focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500`}
              onClick={() => setSelectedButton("button2")}
            >
              Raffles Created
            </button>

            <ul
              role="list"
              className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
              {selectedButton === "button1" && (
                <>
                  {!rafflesForParticipant ||
                    (rafflesForParticipant.data?.length === 0 && (
                      <div className="ml-2 pl-2 font-mono text-lg text-light">
                        No Entered Raffles Found
                      </div>
                    ))}
                  {rafflesForParticipant.data?.map(
                    (raffle: any, index: any) => (
                      <li key={raffle.raffle.id} className="relative">
                        <Link href={`/raffles/${raffle.raffle.id}`}>
                          <RaffleCard
                            raffleId={raffle.raffle.id!}
                            imageUrl={raffle.raffle.nftTokenURI!}
                            nftName={raffle.raffle.nftTokenName!}
                            nftCollectionName={raffle.raffle.nftCollectionName!}
                            nftContractAddress={
                              raffle.raffle.nftContractAddress!
                            }
                            raffleEndDate={raffle.raffle.endDate!}
                            ticketPrice={raffle.raffle.ticketPrice}
                            ticketsRemaining={
                              raffle.raffle.ticketSupply -
                              raffle.raffle.ticketsSold
                            }
                            totalTickets={raffle.raffle.ticketSupply}
                            isLast={false}
                            newLimit={() => {}}
                            contractRaffleId={raffle.raffle.contractRaffleId}
                          />
                        </Link>
                      </li>
                    )
                  )}
                </>
              )}

              {selectedButton === "button2" && (
                <>
                  {!rafflesCreated ||
                    (rafflesCreated.data?.length === 0 && (
                      <div className="ml-2 pl-2 font-mono text-lg text-light">
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
                          nftContractAddress={raffle.nftContractAddress!}
                          raffleEndDate={raffle.endDate!}
                          ticketPrice={raffle.ticketPrice}
                          ticketsRemaining={
                            raffle.ticketSupply - raffle.ticketsSold
                          }
                          totalTickets={raffle.ticketSupply}
                          isLast={false}
                          newLimit={() => {}}
                          contractRaffleId={raffle.contractRaffleId}
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
      <Footer />
    </>
  );
};

export default profile;
