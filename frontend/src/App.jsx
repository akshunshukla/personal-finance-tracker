import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analytics from "./pages/Analytics"; // This is our Dashboard
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import Transactions from "./pages/Transactions";
// Protects routes that need authentication
const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a spinner component

  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Dashboard) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* The Dashboard is the default home page */}
            <Route path="/" element={<Analytics />} />
            <Route path="/analytics" element={<Analytics />} />

            <Route path="/transactions" element={<Transactions />} />
          </Route>
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
