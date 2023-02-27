import React from "react";
import { api } from "~/utils/api";
import Error from "next/error";
import { useRouter } from "next/router";
import Image from "next/image";

import Navbar from "~/components/Navbar";
import ExpandedRaffle from "~/components/ExpandedRaffle";

const raffle = () => {
  const router = useRouter();
  const postId = router.query.id as string;
  const { data, isLoading } = api.raffle.getRaffleById.useQuery(postId);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
          <Image src="/rings.svg" alt="loader" width={200} height={200} />
        </div>
      </div>
    );
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <Navbar />
      {data.nftTokenName}
      <ExpandedRaffle />
    </div>
  );
};

export default raffle;
