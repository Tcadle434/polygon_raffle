import { useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";
import { z } from "zod";
import RaffleCard from "~/components/RaffleCard";
import Navbar from "~/components/Navbar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const tempImgUrls = [
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng",
  // Add more image URLs here...
];

type Props = {
  loadMore: () => Promise<void>;
};

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
});

interface RaffleType {
  ticketSupply: number;
  ticketPrice: number;
  ticketsSold: number;
  endDate: Date;
  nftContractAddress: string;
  nftTokenId: string;
  nftTokenURI: string | null;
  nftTokenName: string | null;
  nftCollectionName: string | null;
  winnerWalletAddress: string | null;
  creatorWalletAddress: string;
}

const Home = ({ loadMore }: Props) => {
  // const [images, setImages] = useState(tempImgUrls.slice(0, 50));
  const [images, setImages] = useState<string[] | never[]>([]);
  const [page, setPage] = useState(1);
  const [raffles, setRaffles] = useState<RaffleType>({} as RaffleType);

  const fetchImages = async () => {
    // const response = await fetch(`${BASE_URL}?query=tea&page=${page}`, {
    //   headers: {
    //     Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH}`,
    //   },
    // });
    // const { results } = await response.json();
    const results = tempImgUrls.slice(0, 50);
    setImages((prev) => [...prev, ...results]);
  };

  const getRaffleObjects = async () => {
    const raffleObjets = api.raffle.getAllRaffles.useQuery();
    console.log("raffleObjects: ", raffleObjets);
    // setRaffles(...raffles, raffleObjets);
  };

  useEffect(() => {
    // const raffleObjets = api.raffle.getAllRaffles.useQuery();
    // console.log("raffleObjects: ", raffleObjets);
    // console.log(raffleResults.data);
    fetchImages();
  }, [page]);

  const allRaffles = api.raffle.getAllRaffles.useQuery();
  if (!allRaffles.data)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
        <img src="/bars.svg" alt="loading" />
      </div>
    );

  return (
    <>
      <Head>
        <title>Polygon Raffle App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center  bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
        <div className=" gap-12 px-4 py-16 ">
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {allRaffles.data.map((raffle, index) => (
              <li key={raffle.id} className="relative">
                <RaffleCard
                  imageUrl={raffle.nftTokenURI!}
                  nftName={raffle.nftTokenName!}
                  nftCollectionName={raffle.nftCollectionName!}
                  raffleTimeRemaining={raffle.endDate.toString()}
                  ticketPrice={raffle.ticketPrice}
                  ticketsRemaining={raffle.ticketSupply - raffle.ticketsSold}
                  totalTickets={raffle.ticketSupply}
                  isLast={index === images.length - 1}
                  newLimit={() => setPage(page + 1)}
                />
              </li>
            ))}
            {/* {images.map((image, index) => (
              <li key={image} className="relative">
                <RaffleCard
                  imageUrl={image}
                  nftName="DeDog #44"
                  nftCollectionName="DeDogs"
                  raffleTimeRemaining="2 days 3 hours 5 minutes"
                  ticketPrice={1}
                  ticketsRemaining={2}
                  totalTickets={10}
                  isLast={index === images.length - 1}
                  newLimit={() => setPage(page + 1)}
                />
              </li>
            ))} */}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
