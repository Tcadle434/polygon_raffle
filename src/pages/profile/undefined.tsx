import React from "react";
import Navbar from "~/components/Navbar";

const undefined = () => {
  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-[#59368B] to-slate-900">
      <Navbar />
      <div className="grid h-screen place-items-center font-mono text-light">
        <p>Please connect your wallet to view your profile!</p>
      </div>
    </div>
  );
};

export default undefined;
