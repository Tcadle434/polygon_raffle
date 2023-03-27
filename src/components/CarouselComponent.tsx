import React from "react";

interface CarouselComponentProps {
  collectionName: string;
  collectionDescription: string;
  collectionBannerUrl: string;
  collectionLogoUrl: string;
  marketplaceUrl: string;
  marketplaceName: string;
}

const CarouselComponent = ({
  collectionName,
  collectionDescription,
  collectionBannerUrl,
  collectionLogoUrl,
  marketplaceUrl,
  marketplaceName,
}: CarouselComponentProps) => {
  return (
    <div className="border-1 relative flex h-32 w-full flex-col items-center rounded border-white sm:h-48 md:h-64 lg:h-96">
      <img
        src={collectionBannerUrl}
        alt="Advertisement Banner"
        className="h-full w-full object-cover opacity-40"
      />
      <div className="absolute top-0 right-0 rounded-full pr-4 md:py-6 md:pr-16">
        <img
          src={collectionLogoUrl}
          alt="Logo"
          className="h-8 w-auto rounded-full md:h-16"
        />
      </div>
      <div className="absolute bottom-0 left-0 py-3 pl-8 md:py-6 md:pl-16">
        <h3 className="font-mono text-lg text-white md:text-4xl md:tracking-wide ">
          {collectionName}
        </h3>
        <p className="block truncate text-sm text-gray-200 line-clamp-1 md:text-lg md:tracking-wide ">
          {collectionDescription}
        </p>
        <a href={marketplaceUrl}>
          <button className="mt-2 inline-flex items-center justify-center rounded-lg bg-light px-3 py-2 text-center text-xs font-medium text-white hover:bg-pink-200 focus:outline-none focus:ring-4 focus:ring-purple-300 md:mt-4 md:text-sm">
            Trade on {marketplaceName}
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
        </a>
      </div>
    </div>
  );
};

export default CarouselComponent;
