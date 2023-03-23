import React from "react";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../features/messages/messagesApi";
import InboxContainer from "../InboxContainer/InboxContainer";
import MessageForm from "../MessageForm/MessageForm";
import MessagePerson from "../MessagePerson/MessagePerson";
import Sidebar from "../Sidebar/Sidebar";

const SpecificChat = () => {
  const { id } = useParams();
  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(id);
  console.log(messages);
  // decide what to render
  let content = null;
  if (isLoading) content = <div>Loading...</div>;
  if (!isLoading && isError) content = <div>{error?.message}</div>;
  if (!isLoading && !isError && messages?.length >= 0) {
    content = (
      <div className="w-full grid conversation-row-grid">
        <MessagePerson message={messages[0]} />
        <InboxContainer messages={messages} />
        <MessageForm message={{message: messages[0], id}} />
      </div>
    );
  }
  return (
    <>
      <div className="max-w-7xl mx-auto -mt-1">
        <div className="min-w-full border rounded flex lg:grid lg:grid-cols-3">
          <Sidebar />
          <div className="w-full lg:col-span-2 lg:block">{content}</div>
        </div>
      </div>
    </>
  );
};

export default SpecificChat;
