import { useState, useEffect } from "react";
import { riderApi } from "../services/riderApi";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function RiderEarnings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await riderApi.getOrderHistory();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch earnings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  // Helper: Check if date is today
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Metrics
  const todayEarnings = deliveredOrders
    .filter((o) => isToday(o.created_at))
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const totalEarnings = deliveredOrders.reduce(
    (sum, o) => sum + (o.total_amount || 0),
    0
  );
  const totalTrips = deliveredOrders.length;

  // View Data
  const stats = [
    {
      label: "Today",
      value: `Rs ${todayEarnings.toFixed(0)}`,
      trend: "+100%",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Paid",
      value: `Rs ${totalEarnings.toFixed(0)}`,
      trend: "+5%",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Trips",
      value: totalTrips.toString(),
      trend: "+1",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const weeklyData = [65, 45, 78, 52, 90, 110, 85];
  const maxVal = Math.max(...weeklyData);

  if (loading) return <div className="p-6">Loading earnings...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Earnings</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-foreground">Weekly Activity</h2>
          <select className="bg-accent text-foreground text-sm border-none rounded-lg px-3 py-1 cursor-pointer outline-none hover:bg-accent/80 transition-colors">
            <option>Last 7 Days</option>
            <option>Last Month</option>
          </select>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between h-48 gap-4">
          {weeklyData.map((val, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            >
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-8 bg-foreground text-background text-xs font-bold py-1 px-2 rounded pointer-events-none">
                Rs {val}
              </div>
              <div
                className="w-full bg-primary/20 hover:bg-primary rounded-t-lg transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                style={{ height: `${(val / maxVal) * 100}%` }}
              >
                {/* Active Indicator for 'Today' (last one) */}
                {i === weeklyData.length - 1 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/50" />
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-card rounded-2xl border border-border pb-4">
        <div className="p-6 border-b border-border mb-2">
          <h2 className="text-lg font-bold text-foreground">Recent Payouts</h2>
        </div>
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="px-6 py-4 flex items-center justify-between hover:bg-accent/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Weekly Payout
                </h4>
                <p className="text-xs text-secondary">Dec 12, 2025 • 4:32 PM</p>
              </div>
            </div>
            <span className="font-bold text-foreground">+Rs 845</span>
          </div>
        ))}
      </div>
    </div>
  );
}
