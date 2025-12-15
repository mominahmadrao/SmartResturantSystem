import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  ShoppingBag,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Star,
} from "lucide-react";
import Card from "../../components/ui/Card";
import api from "../../api/axios";

const MetricCard = (
  { title, value, change, icon: MetricIcon, trend } // eslint-disable-line no-unused-vars
) => (
  <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
    <div className="absolute right-0 top-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
        <MetricIcon size={24} />
      </div>
    </div>
    <div
      className={`flex items-center text-sm font-semibold ${
        trend === "up" ? "text-green-500" : "text-red-500"
      }`}
    >
      {trend === "up" ? (
        <ArrowUpRight size={16} className="mr-1" />
      ) : (
        <ArrowDownRight size={16} className="mr-1" />
      )}
      {change}
      <span className="text-slate-400 font-normal ml-1">vs last month</span>
    </div>
  </Card>
);

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: "$0",
    totalOrders: "0",
    avgDeliveryTime: "0m",
    totalCustomers: "0",
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          revenueRes,
          ordersRes,
          deliveryRes,
          customersRes,
          dailyRevenueRes,
          topItemsRes,
        ] = await Promise.all([
          api.get("/admin/analytics/total-revenue"),
          api.get("/admin/analytics/total-orders"),
          api.get("/admin/analytics/avg-delivery-time"),
          api.get("/admin/analytics/total-customers"),
          api.get("/admin/analytics/daily-revenue"),
          api.get("/admin/analytics/top-items"),
        ]);

        setMetrics({
          totalRevenue: `$${
            revenueRes.data.total_revenue?.toLocaleString() || 0
          }`,
          totalOrders: ordersRes.data.total_orders?.toLocaleString() || "0",
          avgDeliveryTime: deliveryRes.data.average_delivery_time
            ? `${Math.round(deliveryRes.data.average_delivery_time)}m`
            : "N/A",
          totalCustomers: customersRes.data.total_customers?.toString() || "0",
        });

        // Map daily revenue to chart format
        const chartData = dailyRevenueRes.data.map((item) => ({
          name: new Date(item.day).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          value: item.revenue,
        }));
        setRevenueData(chartData.reverse()); // Show correct chronological order if needed

        // Map top items
        // topItemsRes.data is [[name, count], ...] based on backend inspection
        // Actually sqlmodel .fetchall() returns rows. Fastapi usually serializes them to list of lists or dicts?
        // Let's assume list of objects/lists. The backend query was `SELECT mi.name, SUM(...)`.
        // SQLModel/FastAPI with `fetchall()` often returns list of tuples/objects.
        // Let's adjust based on likely response.
        const items = topItemsRes.data.map((item, index) => ({
          id: index,
          name: item.name || item[0], // Handle both obj and tuple
          sales: item.total_sold || item[1],
          revenue: "-", // Not available yet
          rating: "5.0", // Mock
        }));
        setTopItems(items);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Welcome back, Admin. Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
              Live Orders
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            change="+0%" // Diffs not calculated yet
            icon={DollarSign}
            trend="up"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            change="+0%"
            icon={ShoppingBag}
            trend="up"
          />
          <MetricCard
            title="Avg. Delivery Time"
            value={metrics.avgDeliveryTime}
            change="0m"
            icon={Clock}
            trend="down"
          />
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers}
            change="+1"
            icon={Users}
            trend="up"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Revenue Overview
              </h3>
              <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1 outline-none">
                <option>Start of this week</option>
                <option>Last week</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Items List */}
          <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              Top Selling Items
            </h3>
            <div className="space-y-6">
              {topItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">
                      {item.name}
                    </h4>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Package size={12} className="mr-1" /> {item.sales} sold
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{item.revenue}</p>
                    <div className="flex items-center justify-end text-xs text-yellow-500 mt-1">
                      <Star size={10} fill="currentColor" className="mr-0.5" />{" "}
                      {item.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              View All Items
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
