import React, { useEffect, useState } from "react";
import Image from "next/image";
import { verified } from "~/lib/verified";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

interface CardProps {
  imageUrl: string;
  nftName: string;
  nftCollectionName: string;
  nftContractAddress: string;
}

const SmallRaffleCard = ({
  imageUrl,
  nftName,
  nftCollectionName,
  nftContractAddress,
}: CardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
      <div className="py-5 px-2">
        <div className="flex flex-row items-center">
          <h5 className=" text-md mr-1 text-left font-bold tracking-tight text-light line-clamp-1">
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
        <p className="mt mb-3 text-left text-sm font-normal text-white line-clamp-1">
          {nftName}
        </p>
      </div>
    </div>
  );
};

export default SmallRaffleCard;
