import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { riderApi } from "../services/riderApi";
import { useRiderLocation } from "../hooks/useRiderLocation";
import RiderMap from "../components/RiderMap";
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { cn } from "../lib/utils";

export default function RiderOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { location: riderLocation } = useRiderLocation();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await riderApi.getOrderDetails(id);
        setOrder(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateStatus = async (status) => {
    // Optimistic update
    setOrder((prev) => ({ ...prev, status }));
    await riderApi.updateOrderStatus(id, status);
  };

  if (loading)
    return (
      <div className="h-screen bg-background flex items-center justify-center text-secondary">
        Loading details...
      </div>
    );
  if (!order)
    return (
      <div className="h-screen bg-background flex items-center justify-center text-red-400">
        Order not found
      </div>
    );

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Top Bar - Absolute */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 pointer-events-auto hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 text-xs font-bold border border-white/10">
          {order.status === "assigned"
            ? "PICKUP"
            : order.status === "picked_up"
            ? "DELIVERY"
            : "DONE"}
        </div>
      </div>
      <div className="max-w-md mx-auto h-[100dvh] flex flex-col relative bg-background">
        {/* Map Section */}
        <div className="h-[45vh] bg-gray-100 flex-shrink-0 relative">
          <RiderMap
            restaurant={{
              lat: order.restaurant_lat || 31.5204,
              lng: order.restaurant_lng || 74.3587,
              name: order.restaurant_name || "Unknown Restaurant",
            }}
            customer={{
              lat: order.customer_lat || 31.53,
              lng: order.customer_lng || 74.36,
              name: order.customer_name || "Customer",
            }}
          />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-lg z-10 hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Order Info Sheet */}
        <div className="flex-1 bg-background -mt-6 rounded-t-3xl relative z-10 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] px-6 pt-8 overflow-y-auto pb-24">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {order.status === "assigned"
                  ? order.restaurant_name || "Restaurant HQ"
                  : order.customer_name || "Customer"}
              </h2>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate max-w-[200px]">
                  {order.status === "assigned"
                    ? order.restaurant_address || "Pickup Location"
                    : order.customer_address || "Delivery Location"}
                </span>
              </div>
            </div>
            <button className="p-3 bg-accent rounded-full text-foreground hover:bg-accent-hover transition-colors border border-border">
              <Phone className="w-5 h-5" />
            </button>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-border/40 last:border-0"
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-accent text-xs font-bold rounded mr-3 text-foreground">
                      {item.quantity}x
                    </span>
                    <span className="text-foreground text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-medium text-foreground">Total to pay</span>
              <span className="text-xl font-bold text-foreground">
                Rs {order.total_amount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Fixed at Bottom */}
        <div className="p-4 bg-background border-t border-border">
          {order.status === "pending" && (
            <button
              onClick={() => updateStatus("assigned")}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Accept Delivery</span>
            </button>
          )}
          {(order.status === "assigned" || order.status === "ready") && (
            <button
              onClick={() => updateStatus("picked_up")}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Swipe to Pick Up</span>
            </button>
          )}
          {order.status === "picked_up" && (
            <button
              onClick={() => updateStatus("delivered")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-center flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Complete Delivery</span>
            </button>
          )}
          {order.status === "delivered" && (
            <div className="w-full py-4 bg-accent/50 border border-emerald-500/20 text-emerald-500 font-bold rounded-xl text-center">
              Order Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
