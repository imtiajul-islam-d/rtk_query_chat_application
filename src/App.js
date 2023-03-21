import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Inbox from "./components/Inbox/Inbox";
import Login from "./components/Login/Login";
import Nav from "./components/Nav/Nav";
import PrivetRoute from "./components/PrivetRoute/PrivetRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import Registration from "./components/Registration/Registration";
import "./dist/output.css";
import useAuthCheck from "./hooks/useAuthChek";

function App() {
  const authCheck = useAuthCheck();

  return !authCheck ? (
    <div>Loading...</div>
  ) : (
    <>
      <Nav></Nav>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Registration />
              </PublicRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <PrivetRoute>
                <Chat />
              </PrivetRoute>
            }
          />
          <Route
            path="/inbox/:id"
            element={
              <PrivetRoute>
                <Inbox />
              </PrivetRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
