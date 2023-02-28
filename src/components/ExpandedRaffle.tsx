import React from "react";
import Image from "next/image";
import { NextPage } from "next";
import z from "zod";

import Divider from "./Divider";
import ParticipantList from "./ParticipantList";

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
}) => {
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
                          {ticketSupply - ticketsSold} / {ticketSupply}
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
                          {endDate.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col ">
                        <label className="text-md text-secondary line-clamp-1">
                          Raffler Address
                        </label>
                        <p className="mb-3 font-normal text-gray-500">
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
