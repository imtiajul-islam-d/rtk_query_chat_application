import React from "react";
import { useSelector } from "react-redux";
import Inbox from "../Inbox/Inbox";

const InboxContainer = ({ messages = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  console.log(messages);
  return (
    <>
      <div className="relative w-full p-6 overflow-y-auto">
        <ul className="space-y-2">
          {/* inbox */}
          {messages?.map((message) => {
            const { message: lastMessage, id, sender } = message || {};
            const justify =
              sender?.email !== email ? "justify-start" : "justify-end";
            return <Inbox key={id} message={lastMessage} justify={justify} />;
          })}
          <Inbox />
        </ul>
      </div>
    </>
  );
};

export default InboxContainer;
