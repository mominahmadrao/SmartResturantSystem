import { useState } from "react";
import { useRiderOrders } from "../hooks/useRiderOrders";
import RiderOrderCard from "../components/RiderOrderCard";
import { RefreshCw, TrendingUp, Search } from "lucide-react";
import { cn } from "../lib/utils";

export default function RiderDashboard() {
  const { orders, loading, refreshOrders } = useRiderOrders();
  const [filter, setFilter] = useState("all");

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 pt-6 sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          <button
            onClick={refreshOrders}
            className="p-2.5 bg-accent hover:bg-accent-hover text-foreground rounded-full transition-colors active:scale-95 border border-border"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-accent to-accent/50 rounded-xl border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8" />
            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
              Earnings
            </p>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-foreground">Rs 148</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="p-3 bg-gradient-to-br from-accent to-accent/50 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
              Completed
            </p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {["all", "pending", "assigned", "picked_up", "delivered"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  filter === status
                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-[0_0_10px_rgba(43,176,166,0.3)]"
                    : "bg-transparent text-muted-foreground border-border hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                )}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {loading && orders.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
            Loading orders...
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <RiderOrderCard key={order.order_id} order={order} />
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-secondary/50" />
            </div>
            <p className="text-foreground font-medium">No orders found</p>
            <p className="text-muted-foreground text-sm">
              Try changing filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
