import React from "react";
import Navbar from "~/components/Navbar";

const undefined = () => {
  return (
    <div className="bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
      <Navbar />
      <div className="grid h-screen place-items-center">
        <p>Please connect your wallet to view your profile!</p>
      </div>
    </div>
  );
};

export default undefined;
