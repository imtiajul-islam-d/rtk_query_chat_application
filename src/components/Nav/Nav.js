import React from "react";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../../features/auth/authSlice";
import logo from "./../../assets/logo.svg";

const Nav = () => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem("auth");
  };
  return (
    <>
      <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16 items-center">
            <img className="h-10" src={logo} alt="Logo" />
            <ul>
              <li className="text-white">
                <span className="cursor-pointer" onClick={logout}>
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
