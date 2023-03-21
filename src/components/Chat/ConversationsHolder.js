import React from "react";
import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import Conversation from "./Conversation";

const ConversationsHolder = () => {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationsQuery(email);
  //  decide what to render
  let content = null;
  if (isLoading) content = <li className="m-2 text-center">Loading...</li>;
  if (!isLoading && isError)
    content = <li className="m-2 text-center">{error?.message}</li>;
  if (!isLoading && !isError && conversations.length === 0)
    content = <li>No conversations found!</li>;
  if (!isLoading && !isError && conversations.length > 0) {
    content = conversations?.map((conv) => (
      <Conversation key={conv?.id} conv={conv} />
    ));
  }

  return (
    <>
      <li>{content}</li>
    </>
  );
};

export default ConversationsHolder;
