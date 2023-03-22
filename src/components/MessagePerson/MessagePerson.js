import React from "react";
import { useSelector } from "react-redux";
import getAvatar from "gravatar-url";

const MessagePerson = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const { sender, receiver } = message || {};
  const partnersEmail =
    sender?.email === email ? receiver?.email : sender?.email;
  const partnersName = sender?.email === email ? receiver?.name : sender?.name;
  return (
    <>
      <div className="relative flex items-center p-3 border-b border-gray-300">
        <img
          className="object-cover w-10 h-10 rounded-full"
          src={getAvatar(partnersEmail, {
            size: 80
          })}
          alt="username"
        />
        <span className="block ml-2 font-bold text-gray-600">
          {partnersName}
        </span>
        <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
      </div>
    </>
  );
};

export default MessagePerson;
