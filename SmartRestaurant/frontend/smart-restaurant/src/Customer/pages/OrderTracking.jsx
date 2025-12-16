import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../../api/axios";

export default function OrderTracking() {
  const location = useLocation();
  const [status, setStatus] = useState("Loading...");
  const [orderId, setOrderId] = useState(location.state?.orderId || null);

  useEffect(() => {
    const fetchOrderId = async () => {
      if (!orderId) {
        try {
          // Fetch latest active order if none provided
          const res = await api.get("/orders/");
          // Find first order that is NOT delivered or cancelled
          const activeOrder = res.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Newest first
            .find((o) => !["delivered", "cancelled"].includes(o.status));

          if (activeOrder) {
            setOrderId(activeOrder.order_id);
          }
        } catch (e) {
          console.error("Failed to find active order", e);
        }
      }
    };
    fetchOrderId();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setStatus(response.data.status); // pending, ready, picked_up, delivered
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="container text-center py-10">
        <h2>No Active Order</h2>
        <Link to="/menu" className="text-blue-500 underline">
          Order something first
        </Link>
      </div>
    );
  }

  // Helper to format status display
  const getStatusDisplay = (s) => {
    switch (s) {
      case "pending":
        return "Order Placed (Waiting for Confirmation)";
      case "ready":
        return "Preparing / Ready for Pickup";
      case "picked_up":
        return "Out for Delivery"; // Or Assigned/Picked Up
      case "assigned":
        return "Rider Assigned";
      case "delivered":
        return "Delivered";
      default:
        return s;
    }
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
      <p className="text-gray-600 mb-2">Order ID: #{orderId}</p>

      <div className="p-6 bg-white rounded-xl shadow-sm border inline-block min-w-[300px]">
        <p className="text-lg">Current Status:</p>
        <strong className="text-xl text-[hsl(var(--primary))] block mt-2">
          {getStatusDisplay(status)}
        </strong>
      </div>
    </div>
  );
}
