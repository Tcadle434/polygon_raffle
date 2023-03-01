import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";

const profile = () => {
  const router = useRouter();
  const profileWalletAddress = router.query.id as string;
  const participantResponse =
    api.participant.getParticipantByWalletAddress.useQuery(
      profileWalletAddress
    );
  const winnerResponse =
    api.raffle.getRaffleByWinnerWalletAddress.useQuery(profileWalletAddress);

  return (
    <div className="bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
      <Navbar />
      <h1>Profile</h1>
      <div></div>
    </div>
  );
};

export default profile;
