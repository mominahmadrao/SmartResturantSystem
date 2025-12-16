import { MapPin, Clock, ChevronRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function RiderOrderCard({ order }) {
  const navigate = useNavigate();

  const statusStyles = {
    assigned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    ready: "bg-green-500/10 text-green-400 border-green-500/20",
    picked_up: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div
      onClick={() => navigate(`/rider/orders/${order.order_id}`)}
      className={cn(
        "group relative p-4 mb-3 rounded-2xl border border-border bg-accent/30 hover:bg-accent transition-all duration-300 cursor-pointer overflow-hidden",
        "hover:shadow-[0_0_20px_-12px_rgba(255,255,255,0.1)]"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-background rounded-lg border border-border">
            <Package className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              {order.restaurant_name || "Unknown Restaurant"}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              #{order.order_id}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border",
            statusStyles[order.status]
          )}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-2 mb-4 pl-1">
        <div className="flex items-center px-2 py-1.5 rounded-lg bg-background/50 border border-transparent group-hover:border-border/50 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3" />
          <p className="text-sm text-muted-foreground truncate">
            {order.restaurant_address || "No Address"}
          </p>
        </div>
        <div className="flex items-center px-2 py-1.5 rounded-lg bg-background/50 border border-transparent group-hover:border-border/50 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3" />
          <p className="text-sm text-muted-foreground truncate">
            {order.customer_address || "No Address"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
}
