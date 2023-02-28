import React from "react";

interface Participants {
  walletAddress: string;
  ticketsBought: number;
}

interface ListProps {
  items: Participants[];
}

const ParticipantList: React.FC<ListProps> = ({ items }) => {
  return (
    <ul className="max-h-64 overflow-y-auto">
      {items.map((item) => (
        <li key={item.walletAddress} className="py-2">
          <div className=" flex flex-row justify-between border-t-2 border-b-2">
            <p>{item.walletAddress}</p>
            <p>{item.ticketsBought}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ParticipantList;
