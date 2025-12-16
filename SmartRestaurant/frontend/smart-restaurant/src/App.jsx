import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./Rider/components/ThemeProvider"; // Rider Theme Provider

// --- Admin / Auth Imports ---
import Login from "./Admin/pages/Login";
import Signup from "./Admin/pages/Signup";
import RiderSignup from "./Admin/pages/RiderSignup";
import Analytics from "./Admin/pages/admin/Analytics";
import MenuManagement from "./Admin/pages/admin/MenuManagement";
import OrderManagement from "./Admin/pages/admin/OrderManagement";
import AdminLayout from "./Admin/components/AdminLayout";

// --- Customer Imports ---
import { CartProvider } from "./Customer/context/CartContext";
import CustomerLayout from "./Customer/components/CustomerLayout";
import Home from "./Customer/pages/Home";
import Menu from "./Customer/pages/Menu";
import Cart from "./Customer/pages/Cart";
import Checkout from "./Customer/pages/Checkout";
import OrderTracking from "./Customer/pages/OrderTracking";
import OrderHistory from "./Customer/pages/OrderHistory";

// --- Rider Imports ---
import RiderLayout from "./Rider/components/RiderLayout";
import RiderDashboard from "./Rider/pages/RiderDashboard";
import RiderOrderDetails from "./Rider/pages/RiderOrderDetails";
import RiderHistory from "./Rider/pages/RiderHistory";
import RiderProfile from "./Rider/pages/RiderProfile";
import RiderEarnings from "./Rider/pages/RiderEarnings";

import "./App.css"; // Unified CSS

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="smart-rider-theme">
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* --- Auth Routes (Entry Point) --- */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/rider-signup" element={<RiderSignup />} />

              <Route path="/rider-signup" element={<RiderSignup />} />

              {/* --- Admin Routes --- */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="analytics" replace />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="orders" element={<OrderManagement />} />
              </Route>

              {/* --- Customer Routes --- */}
              <Route element={<CustomerLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/history" element={<OrderHistory />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
              </Route>

              {/* --- Rider Routes --- */}
              <Route path="/rider" element={<RiderLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<RiderDashboard />} />
                <Route path="history" element={<RiderHistory />} />
                <Route path="earnings" element={<RiderEarnings />} />
                <Route path="profile" element={<RiderProfile />} />
                <Route path="orders/:id" element={<RiderOrderDetails />} />
              </Route>

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="p-10 text-center">
                    <h1>404 - Page Not Found</h1>
                  </div>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
