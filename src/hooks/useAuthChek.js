import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

const useAuthCheck = () => {
  const [authCheck, setAuthCheck] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const localAuth = JSON.parse(localStorage.getItem("auth"));
    if (localAuth) {
      if (localAuth?.accessToken && localAuth?.user) {
        dispatch(
          userLoggedIn({
            accessToken: localAuth?.accessToken,
            user: localAuth?.user,
          })
        );
      }
    }
    setAuthCheck(true);
  }, []);
  return authCheck;
};
export default useAuthCheck;
