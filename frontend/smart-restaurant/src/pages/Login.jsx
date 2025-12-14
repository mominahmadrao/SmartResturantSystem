import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Bike, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Login = () => {
  const [role, setRole] = useState("customer"); // customer, rider, admin
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  /* import removed */

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: formData.email,
          password: formData.password,
        })
      );

      const { access_token, role: userRole } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", userRole);

      if (userRole === "admin") {
        navigate("/admin/analytics");
      } else if (userRole === "rider") {
        alert("Logged in as Rider (Dashboard coming soon)");
      } else {
        alert("Logged in as Customer (Home coming soon)");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Please check your credentials.");
    }
  };

  const roles = [
    { id: "customer", label: "Customer", icon: User },
    { id: "rider", label: "Rider", icon: Bike },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 z-0" />

      <Card className="w-full max-w-md relative z-10 glass-dark">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            OnTheGo
          </h1>
          <p className="text-slate-400 mt-2">
            Welcome back! Please login to continue.
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex p-1 bg-slate-800/50 rounded-xl mb-8 relative">
          <div
            className="absolute h-[calc(100%-8px)] top-1 bg-slate-700/80 rounded-lg shadow-sm transition-all duration-300 ease-in-out"
            style={{
              width: `${100 / 3 - 2}%`,
              left: `${roles.findIndex((r) => r.id === role) * (100 / 3) + 1}%`,
            }}
          />
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-200 ${
                role === r.id
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <r.icon size={16} />
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="text-slate-200"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="text-slate-200"
            />
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-8">
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
            <ArrowRight size={20} />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          {role === "admin" ? (
            <span className="text-slate-500">Contact IT</span>
          ) : (
            <Link
              to={role === "rider" ? "/rider-signup" : "/signup"}
              className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign up as {role === "rider" ? "Rider" : "Customer"}
            </Link>
          )}
        </div>
      </Card>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
    </div>
  );
};

export default Login;
