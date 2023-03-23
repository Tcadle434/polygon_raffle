import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import CountdownTimer from "./CountdownTimer";
import { verified } from "~/lib/verified";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

interface CardProps {
  raffleId: string;
  imageUrl: string;
  nftName: string;
  nftCollectionName: string;
  nftContractAddress: string;
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
  nftContractAddress,
  raffleEndDate,
  ticketPrice,
  ticketsRemaining,
  totalTickets,
  newLimit,
  isLast,
}: CardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const cardRef = useRef();
  const totalTicketsSold =
    api.participant.getTotalNumTicketsByRaffleId.useQuery(raffleId);

  useEffect(() => {
    if (!cardRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry!.isIntersecting) {
        newLimit();
        observer.unobserve(entry!.target);
      }
    });

    observer.observe(cardRef.current);
  }, [isLast]);

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
    <div className="max-w-sm rounded-lg border border-gray-700 bg-[#59368B] shadow transition duration-300 ease-in-out hover:scale-105 hover:transform">
      <div style={{ position: "relative", width: "100%", paddingTop: "100%" }}>
        {!isImageLoaded && (
          <div className="flex flex-col items-center">
            <Image
              src="/rings.svg"
              alt="loader"
              className="rounded-t-lg"
              loading="lazy"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        )}
        <div className="flex flex-col items-center">
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
      </div>
      <div className="p-5">
        <div className="flex flex-row items-center">
          <h5 className=" mr-1 text-2xl font-bold tracking-tight text-light line-clamp-1">
            {nftCollectionName}
          </h5>
          {isVerified ? (
            <button title="The Raffi3 team has marked this as a verified collection">
              <CheckBadgeIcon width={25} color="#8FFFE6" />
            </button>
          ) : (
            <button title="This collection has not been verfified by the Raffi3 team. Be careful! Please reach out to get the collection added if it is legitimate">
              <ExclamationTriangleIcon width={25} color="yellow" />
            </button>
          )}
        </div>
        <p className="mt mb-3 font-normal text-white line-clamp-1">{nftName}</p>
        <div className="mt-4 flex flex-row justify-between">
          <div className="flex flex-col ">
            <label className="text-md text-newthird line-clamp-1">
              Tickets Remaining
            </label>
            <div className="mb-3 block truncate font-normal text-white sm:inline-block sm:overflow-visible">
              {totalTicketsSold.isLoading && <p>Loading...</p>}
              {totalTicketsSold.data && (
                <p>
                  {totalTickets - totalTicketsSold.data._sum.numTickets!} /{" "}
                  {totalTickets}
                </p>
              )}
            </div>
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
