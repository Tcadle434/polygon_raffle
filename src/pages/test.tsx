import React from "react";
import RaffleCard from "~/components/RaffleCard";

const test = () => {
  return (
    <div>
      <RaffleCard
        imageUrl="https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafybeiachxhxc57f52uoolag74af2nq6g4d2d5eruvij77ewslrczjxmvm.ipfs.dweb.link%2F4078.png%3Fext%3Dpng"
        nftName="DeDog #44"
        nftCollectionName="DeDogs"
        raffleTimeRemaining="2 days 3 hours 5 minutes"
        ticketPrice={1}
        ticketsRemaining={2}
        totalTickets={10}
        isLast={false}
        newLimit={() => {}}
      />
    </div>
  );
};

export default test;
