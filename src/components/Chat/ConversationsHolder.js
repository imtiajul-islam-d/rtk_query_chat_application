import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationsApi,
  useGetConversationsQuery,
} from "../../features/conversations/conversationsApi";
import Conversation from "./Conversation";
import InfiniteScroll from "react-infinite-scroll-component";

const ConversationsHolder = () => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const { data, isLoading, isError, error } =
    useGetConversationsQuery(email) || {};
  const { data: conversations, totalCount } = data || {};
  // scroll page function
  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(
          totalCount / Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE)
        ) > page;
      setHasMore(more);
    }
  }, [totalCount, page]);
  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationsApi.endpoints.getMoreConversations.initiate({
          email,
          page,
        })
      );
    }
  }, [page, email, dispatch]);
  //  decide what to render
  let content = null;
  if (isLoading) content = <li className="m-2 text-center">Loading...</li>;
  if (!isLoading && isError)
    content = <li className="m-2 text-center">{error?.message}</li>;
  if (!isLoading && !isError && conversations?.length === 0)
    content = <li>No conversations found!</li>;
  if (!isLoading && !isError && conversations?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={conversations?.length}
        next={() => fetchMore()}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {conversations?.map((conv) => (
          <Conversation key={conv?.id} conv={conv} />
        ))}
      </InfiniteScroll>
    );
  }

  return (
    <>
      <li>{content}</li>
    </>
  );
};

export default ConversationsHolder;
