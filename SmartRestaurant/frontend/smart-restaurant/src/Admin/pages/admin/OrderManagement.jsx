import React, { useState, useEffect } from "react";
import {
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import api from "../../../api/axios";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
    // Poll for updates every 10s
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      // Admin sees all orders, sort by new
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sorted);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, null, {
        params: { status: newStatus },
      });
      setOrders(
        orders.map((o) =>
          o.order_id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "picked_up":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>
          <p className="text-slate-500">
            Live view of all incoming and past orders.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative group">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
            <Filter size={16} className="mr-2" />
            <span className="capitalize">
              {filter === "all" ? "All Orders" : filter}
            </span>
            <ChevronDown size={16} className="ml-2" />
          </button>
          <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-lg shadow-xl py-1 hidden group-hover:block z-20">
            {[
              "all",
              "pending",
              "assigned",
              "ready",
              "picked_up",
              "delivered",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 capitalize ${
                  filter === s ? "text-primary-600 font-bold" : "text-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400">
                #{order.order_number}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-800 mb-1">
              {order.customer_name || "Unknown Customer"}
            </h3>
            <p className="text-xs text-slate-500 mb-4 flex items-center">
              <Clock size={12} className="mr-1" />
              {new Date(order.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-900">
                ${order.total_amount}
              </span>

              {/* Status Actions */}
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateStatus(order.order_id, "ready")}
                    className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded hover:bg-primary-700 transition-colors"
                  >
                    Prepare
                  </button>
                )}
                {order.status === "ready" && (
                  <span className="text-xs text-slate-400 italic">
                    Waiting for Rider...
                  </span>
                )}

                {/* Fallback Action menu if needed later */}
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
