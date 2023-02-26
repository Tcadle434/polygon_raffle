import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

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

const Home = ({ loadMore }: Props) => {
  const [images, setImages] = useState(tempImgUrls.slice(0, 50));
  const { scrollRef, loading } = useInfiniteScroll(loadMore);

  const handleLoadMore = async () => {
    await loadMore();
    setImages(images.slice(0, images.length + 50));
  };

  return (
    <>
      <Head>
        <title>Polygon Raffle App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex min-h-screen flex-col  bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
        <div className=" gap-12 px-4 py-16 ">
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {images.map((image) => (
              <li key={image} className="relative">
                <div className="group aspect-w-8 aspect-h-8 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                  <Image
                    src={image}
                    height={150}
                    width={150}
                    alt=""
                    className="pointer-events-none object-cover group-hover:opacity-75"
                  />
                  <button
                    type="button"
                    className="absolute inset-0 focus:outline-none"
                  >
                    {/* <span className="sr-only">View details for {file.title}</span> */}
                  </button>
                </div>
                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                  tmp
                </p>
                <p className="pointer-events-none block text-sm font-medium text-gray-500">
                  tmp
                </p>
              </li>
            ))}
            {loading && (
              <Image src="/rings.svg" height={50} width={50} alt="" />
            )}
            <div ref={scrollRef} className="invisible">
              &nbsp;
            </div>
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
