import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Inbox from "./components/Inbox/Inbox";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import "./dist/output.css";
import useAuthCheck from "./hooks/useAuthChek";

function App() {
  const authCheck = useAuthCheck();

  return !authCheck ? (
    <div>Loading...</div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/inbox" element={<Chat />} />
        <Route path="/inbox/:id" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
