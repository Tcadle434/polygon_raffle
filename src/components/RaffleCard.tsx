import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import CountdownTimer from "./CountdownTimer";

interface CardProps {
  raffleId: string;
  imageUrl: string;
  nftName: string;
  nftCollectionName: string;
  raffleEndDate: Date;
  ticketPrice: number;
  ticketsRemaining: number;
  totalTickets: number;
  newLimit: () => void;
  isLast: boolean;
}

const RaffleCard = ({
  raffleId,
  imageUrl,
  nftName,
  nftCollectionName,
  raffleEndDate,
  ticketPrice,
  ticketsRemaining,
  totalTickets,
  newLimit,
  isLast,
}: CardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardRef = useRef();
  const totalTicketsSold =
    api.participant.getTotalNumTicketsByRaffleId.useQuery(raffleId);

  useEffect(() => {
    console.log(raffleId);
    if (!cardRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry!.isIntersecting) {
        newLimit();
        observer.unobserve(entry!.target);
      }
    });

    observer.observe(cardRef.current);
  }, [isLast]);

  return (
    <div className="max-w-sm rounded-lg border border-gray-700 bg-[#59368B] shadow transition duration-300 ease-in-out hover:scale-105 hover:transform">
      <div style={{ position: "relative", width: "100%", paddingTop: "100%" }}>
        {!isImageLoaded && (
          <div className="">
            <Image src="/rings.svg" alt="loader" width={200} height={200} />
          </div>
        )}
        <Image
          src={imageUrl}
          alt="user NFT"
          className="rounded-t-lg"
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className=" text-2xl font-bold tracking-tight text-light line-clamp-1">
            {nftCollectionName}
          </h5>
        </a>
        <p className="mt mb-3 font-normal text-white line-clamp-1">{nftName}</p>
        <div className="mt-4 flex flex-row justify-between">
          <div className="flex flex-col ">
            <label className="text-md text-newthird line-clamp-1">
              Tickets Remaining
            </label>
            <p className="mb-3 block truncate font-normal text-white sm:inline-block sm:overflow-visible">
              {totalTicketsSold.isLoading && <div>Loading...</div>}
              {totalTicketsSold.data && (
                <div>
                  {totalTickets - totalTicketsSold.data._sum.numTickets!} /{" "}
                  {totalTickets}
                </div>
              )}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-md text-newthird line-clamp-1">
              Ticket Price
            </label>
            <p className="mb-3 block truncate font-normal text-white sm:inline-block sm:overflow-visible">
              {ticketPrice} $MATIC
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-md text-newthird line-clamp-1">
            Time Remaining
          </label>
          <p className="mb-3 font-normal text-white line-clamp-1">
            <CountdownTimer futureDate={raffleEndDate!} />
          </p>
        </div>

        <button className="inline-flex w-full items-center justify-center rounded-lg bg-light px-3 py-2 text-center text-sm font-medium text-white hover:bg-pink-200 focus:outline-none focus:ring-4 focus:ring-purple-300">
          View Raffle
          <svg
            aria-hidden="true"
            className="ml-2 -mr-1 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RaffleCard;
