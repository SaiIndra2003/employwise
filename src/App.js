import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";

function App() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/users"
          element={token ? <Users /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
