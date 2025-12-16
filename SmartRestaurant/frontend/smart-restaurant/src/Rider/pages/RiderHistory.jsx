import { riderApi } from "../services/riderApi";
import { useState, useEffect } from "react";
import { Clock, MapPin, ChevronRight, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export default function RiderHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await riderApi.getOrderHistory();
        setHistory(
          res.data.map((order) => ({
            id: `ORD-${order.order_id}`,
            // Use updated_at or created_at
            date: new Date(order.created_at).toLocaleString(),
            // Hardcode restaurant name if not in order object (it's in rider details but maybe not list)
            // For the list view, we might not have restaurant name unless we join or fetch.
            // The Order model has restaurant_name field!
            restaurant: order.restaurant_name || "Restaurant",
            amount: order.total_amount,
            status: order.status,
            address: order.customer_address || "Customer Address",
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-6">Loading history...</div>;

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-6">Order History</h1>

      <div className="space-y-4">
        {history.map((order) => (
          <div
            key={order.id}
            className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between hover:bg-accent/30 transition-colors cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-foreground truncate">
                  {order.restaurant}
                </h3>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                    order.status === "delivered"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center text-xs text-secondary mb-2">
                <Clock className="w-3 h-3 mr-1" />
                <span>{order.date}</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-foreground">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center text-xs text-secondary truncate">
                <MapPin className="w-3 h-3 mr-1" />
                {order.address}
              </div>
            </div>

            <div className="ml-4">
              <button className="p-2 rounded-full bg-accent text-secondary group-hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="text-primary text-sm font-medium hover:underline">
          Load More
        </button>
      </div>
    </div>
  );
}
