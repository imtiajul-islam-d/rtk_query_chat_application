import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationsApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversationsApi";
import { useGetUserQuery } from "../../features/user/userAPI";
import isValidEmail from "./../../utils/isValidEmail";

export default function Modal({ open, control }) {
  const dispatch = useDispatch();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(undefined);

  const [userCheck, setUserCheck] = useState(false);
  const { data: isUserAvailable } = useGetUserQuery(to, {
    skip: !userCheck,
  });
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { email: myEmail } = loggedInUser || {};

  //
  const [addConversation, { isSuccess: isAddConversationSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSuccess }] =
    useEditConversationMutation();

  useEffect(() => {
    if (isUserAvailable?.length > 0 && isUserAvailable[0]?.email !== myEmail) {
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          email: myEmail,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        });
    }
  }, [isUserAvailable, myEmail, dispatch, to]);

  const doSearch = (value) => {
    if (isValidEmail(value)) {
      setTo(value);
      setUserCheck(true);
      console.log("check");
    }
  };
  const debounceHandler = (fn, delay) => {
    let timeOutId;
    return (...args) => {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const handleSearch = debounceHandler(doSearch, 500);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      // edit
      editConversation({
        sender: myEmail,
        id: conversation[0]?.id,
        data: {
          participants: `${myEmail}-${isUserAvailable[0]?.email}`,
          users: [loggedInUser, isUserAvailable[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
    if (conversation?.length === 0) {
      // add
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${isUserAvailable[0]?.email}`,
          users: [loggedInUser, isUserAvailable[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
    console.log("object");
  };
  useEffect(() => {
    if (isAddConversationSuccess || isEditConversationSuccess) {
      control();
    }
  }, [isAddConversationSuccess, isEditConversationSuccess]);
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  To
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={conversation === undefined}
              >
                Send Message
              </button>
            </div>
            {isUserAvailable?.length === 0 && (
              <p className="text-red-500 text-sm">This user does not exist</p>
            )}
            {isUserAvailable?.length > 0 &&
              isUserAvailable[0]?.email === myEmail && (
                <p className="text-red-500 text-sm">
                  Sorry! you can not send message to yourself!!
                </p>
              )}
          </form>
        </div>
      </>
    )
  );
}
