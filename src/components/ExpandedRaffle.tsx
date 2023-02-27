import React from "react";
import Navbar from "~/components/Navbar";

const ExpandedRaffle = () => {
  return (
    <div className="bg-gradient-to-b from-[#d5bdf5] to-[#fff]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h1 className=" text-4xl">Create a new Raffle</h1>
        {/* Main 3 column grid */}
        <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-4 rounded ">
            <section aria-labelledby="section-1-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2>left col</h2>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4 rounded border lg:col-span-2">
            <section aria-labelledby="section-2-title">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2
                    id="section-2-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Right Col
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This information can only be set once so make sure it's
                    correct.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedRaffle;
