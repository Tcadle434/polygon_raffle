import { useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Error from "next/error";

import { api } from "~/utils/api";
import { z } from "zod";
import RaffleCard from "~/components/RaffleCard";
import Navbar from "~/components/Navbar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { GetServerSideProps } from "next";

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

type RaffleType = z.infer<typeof raffleSchema>;

type RaffleProps = {
  initialData: RaffleType[];
};

const Home = ({ initialData }: RaffleProps) => {
  const [page, setPage] = useState(1);
  const allRaffles = api.raffle.getAllRaffles.useQuery();

  if (allRaffles.isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
          <Image src="/rings.svg" alt="loader" width={200} height={200} />
        </div>
      </div>
    );
  }

  if (!allRaffles.data)
    return (
      <div>
        <Navbar />
        <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
          <h1 className="text-4xl font-bold">No Raffles Found</h1>
          <svg
            className="h-10 w-10"
            fill="currentColor"
            viewBox="0 -28.5 256 256"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <g>
              <g>
                <g>
                  <path
                    d="M256,0C114.617,0,0,114.617,0,256s114.617,256,256,256s256-114.617,256-256S397.383,0,256,0z M256,494.933
				C124.043,494.933,17.067,387.957,17.067,256S124.043,17.067,256,17.067S494.933,124.043,494.933,256S387.957,494.933,256,494.933
				z"
                  />
                  <path
                    d="M162.133,256c20.46,0,34.133-27.346,34.133-59.733c0-32.388-13.673-59.733-34.133-59.733
				c-20.461,0-34.133,27.346-34.133,59.733C128,228.654,141.673,256,162.133,256z M162.133,153.6
				c7.819,0,17.067,18.495,17.067,42.667s-9.248,42.667-17.067,42.667c-7.819,0-17.067-18.495-17.067-42.667
				S154.314,153.6,162.133,153.6z"
                  />
                  <path
                    d="M349.867,136.533c-20.461,0-34.133,27.346-34.133,59.733c0,32.388,13.673,59.733,34.133,59.733
				c20.46,0,34.133-27.346,34.133-59.733C384,163.879,370.327,136.533,349.867,136.533z M349.867,238.933
				c-7.819,0-17.067-18.495-17.067-42.667s9.248-42.667,17.067-42.667s17.067,18.495,17.067,42.667S357.686,238.933,349.867,238.933
				z"
                  />
                  <path
                    d="M392.533,119.467c-18.873,0-34.133-15.26-34.133-34.133c0-4.713-3.82-8.533-8.533-8.533s-8.533,3.82-8.533,8.533
				c0,28.299,22.901,51.2,51.2,51.2c4.713,0,8.533-3.82,8.533-8.533S397.246,119.467,392.533,119.467z"
                  />
                  <path
                    d="M170.667,85.333c0-4.713-3.82-8.533-8.533-8.533s-8.533,3.82-8.533,8.533c0,18.873-15.26,34.133-34.133,34.133
				c-4.713,0-8.533,3.82-8.533,8.533s3.82,8.533,8.533,8.533C147.766,136.533,170.667,113.632,170.667,85.333z"
                  />
                  <path
                    d="M256,298.667c-45.975,0-86.916,24.514-109.784,63.989c-2.362,4.078-0.971,9.299,3.107,11.661
				c4.078,2.362,9.299,0.971,11.661-3.107c19.868-34.298,55.241-55.477,95.016-55.477s75.148,21.179,95.016,55.477
				c2.362,4.078,7.583,5.469,11.661,3.107c4.078-2.362,5.469-7.583,3.107-11.661C342.916,323.18,301.975,298.667,256,298.667z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
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
            {allRaffles.data.map((raffle: any, index: any) => (
              <li key={raffle.id} className="relative">
                <Link href={`/raffles/${raffle.id}`}>
                  <RaffleCard
                    imageUrl={raffle.nftTokenURI!}
                    nftName={raffle.nftTokenName!}
                    nftCollectionName={raffle.nftCollectionName!}
                    raffleTimeRemaining={raffle.endDate.toString()}
                    ticketPrice={raffle.ticketPrice}
                    ticketsRemaining={raffle.ticketSupply - raffle.ticketsSold}
                    totalTickets={raffle.ticketSupply}
                    isLast={index === allRaffles.data.length - 1}
                    newLimit={() => setPage(page + 1)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
