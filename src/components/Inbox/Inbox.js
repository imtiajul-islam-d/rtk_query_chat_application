import React from "react";

const Inbox = ({ message, justify }) => {
  return (
    <>
      <li className={`flex ${justify}`}>
        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
          <span className="block">{message}</span>
        </div>
      </li>
    </>
  );
};

export default Inbox;
