import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RiderSignup from "./pages/RiderSignup";
import Analytics from "./pages/admin/Analytics"; // We will create this next

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rider-signup" element={<RiderSignup />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
