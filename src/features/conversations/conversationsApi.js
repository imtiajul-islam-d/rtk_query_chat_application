import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";
import { io } from "socket.io-client";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
        transformResponse(apiResponse, meta) {
          const totalCount = meta.response.headers.get("X-Total-Count");
          return {
              data: apiResponse,
              totalCount,
          };
      },
      // socket.io start
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io("http://localhost:9000", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });
        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const conversation = draft.find((c) => c.id == data.data.id);
              if (conversation?.id) {
                conversation.message = data?.data?.message;
                conversation.timestamp = data?.data?.timestamp;
              }
            });
          });
        } catch (error) {}
        await cacheEntryRemoved;
        socket.close();
      },
      // socket.io end
    }),
    getMoreConversations: builder.query({
      query: ({ page, email }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const conversations = await queryFulfilled;
          if (conversations?.data?.length > 0) {
            // update message pessimistically start
            dispatch(
              apiSlice.util.updateQueryData(
                "getConversations",
                arg.email,
                (draft) => {
                  return {
                    data: [...draft.data, ...conversations.data],
                    totalCount: Number(draft.totalCount)
                  };
                }
              )
            );
            // update message pessimistically end
          }
        } catch (error) {}
      },
    }),
    getConversation: builder.query({
      query: ({ email, participantEmail }) =>
        `/conversations?participants_like=${email}-${participantEmail}&&participants_like=${participantEmail}-${email}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic update start
        const addResult1 = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              draft.unshift(arg.data);
            }
          )
        );
        // optimistic update end
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = arg.data.users;
            const senderEmail = arg.sender;
            const senderData = users?.find(
              (user) => user?.email === senderEmail
            );
            const receiverData = users?.find(
              (user) => user?.email !== senderEmail
            );
            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderData,
                receiver: receiverData,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();
            // update message pessimistically start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.unshift(res);
                }
              )
            );
            // update message pessimistically end
          }
        } catch (error) {
          addResult1.undo();
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic update start
        const patchResult1 = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftConversation = draft.data.find((c) => c.id == arg.id);
              draftConversation.message = arg.data.message;
              draftConversation.timestamp = arg.data.timestamp;
            }
          )
        );
        // optimistic update end
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = arg.data.users;
            const senderEmail = arg.sender;
            const senderData = users?.find(
              (user) => user?.email === senderEmail
            );
            const receiverData = users?.find(
              (user) => user?.email !== senderEmail
            );
            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderData,
                receiver: receiverData,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();
            // update message pessimistically start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );
            // update message pessimistically end
          }
        } catch (error) {
          patchResult1.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;
