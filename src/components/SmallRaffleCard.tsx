import React, { useState } from "react";
import Image from "next/image";

interface CardProps {
  imageUrl: string;
  nftName: string;
  nftCollectionName: string;
}

const SmallRaffleCard = ({
  imageUrl,
  nftName,
  nftCollectionName,
}: CardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
        <h5 className=" text-md font-bold tracking-tight text-light line-clamp-1">
          {nftCollectionName}
        </h5>
        <p className="mt mb-3 text-sm font-normal text-white line-clamp-1">
          {nftName}
        </p>
      </div>
    </div>
  );
};

export default SmallRaffleCard;
