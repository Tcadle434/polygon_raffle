import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import CarouselComponent from "./CarouselComponent";

const carouselData = [
  {
    collectionName: "HellCats",
    collectionDescription:
      "A collection of 2,500 HellCats that open the doors to The Clubhouse, an exclusive community that extends far beyond the digital world.",
    collectionBannerUrl: "/hellcats_banner.jpeg",
    collectionLogoUrl: "/hellcats_logo.jpeg",
    marketplaceUrl: "https://magiceden.io/collections/polygon/hellcats",
    marketplaceName: "MagicEden",
  },
  {
    collectionName: "The Sandbox",
    collectionDescription:
      "The Sandbox is a community-driven platform where creators can monetize voxel assets and gaming experiences on the blockchain.",
    collectionBannerUrl: "/sandbox_banner.jpeg",
    collectionLogoUrl: "/sandbox_logo.jpeg",
    marketplaceUrl:
      "https://polygon.magiceden.io/collections/polygon/0x9d305a42a3975ee4c1c57555bed5919889dce63f",
    marketplaceName: "MagicEden",
  },
  {
    collectionName: "Voxies",
    collectionDescription:
      "Voxies are cute, lovable and collectible 3d voxel buddies, that live and play on the Polygon blockchain.",
    collectionBannerUrl: "/voxies_banner.jpeg",
    collectionLogoUrl: "/voxies_logo.jpeg",
    marketplaceUrl: "https://opensea.io/collection/voxies",
    marketplaceName: "OpenSea",
  },
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideInterval = 5000;

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, slideInterval);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="border-1 relative flex h-32 w-full flex-col items-center overflow-hidden rounded border-white sm:h-48 md:h-64 lg:h-96">
      {carouselData.map((item, index) => (
        <div
          key={index}
          className={`absolute w-full transition-all duration-500 ${
            index === activeIndex
              ? "translate-x-0 transform opacity-100"
              : "translate-x-full transform opacity-0"
          }`}
        >
          <CarouselComponent {...item} />
        </div>
      ))}

      <button
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-r bg-transparent p-2 text-light"
        onClick={prevSlide}
      >
        <ArrowLeftIcon className="h-6 w-6 md:h-10 md:w-10" />
      </button>
      <button
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-l bg-transparent p-2 text-light"
        onClick={nextSlide}
      >
        <ArrowRightIcon className="h-6 w-6 md:h-10 md:w-10" />
      </button>
    </div>
  );
};

export default Carousel;
