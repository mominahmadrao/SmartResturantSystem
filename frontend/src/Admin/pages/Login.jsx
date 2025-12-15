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
        navigate("/rider/dashboard");
      } else {
        navigate("/home");
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

  // Dynamic Theme Logic
  const getTheme = (currentRole) => {
    switch (currentRole) {
      case "rider":
        return {
          pageBg: "bg-gradient-to-br from-teal-50 via-teal-100/30 to-emerald-50",
          cardClass: "card-rider shadow-2xl shadow-teal-900/5",
          titleGradient: "bg-gradient-to-r from-teal-600 to-emerald-600",
          buttonClass: "btn-rider shadow-lg shadow-teal-500/20",
          activeTabClass: "text-white bg-teal-500 shadow-md",
          inactiveTabClass: "text-slate-500 hover:text-teal-600",
          inputClass: "text-slate-700 bg-white border-teal-100 focus:border-teal-500 focus:ring-teal-500/20",
          linkClass: "text-teal-600 hover:text-teal-700",
          iconColor: "text-teal-500",
        };
      case "admin":
        return {
          pageBg: "bg-gradient-to-br from-gray-50 via-slate-50 to-amber-50/50",
          cardClass: "card-admin shadow-2xl shadow-amber-900/5",
          titleGradient: "bg-gradient-to-r from-gray-800 to-gray-600",
          buttonClass: "btn-admin shadow-lg shadow-amber-500/20",
          activeTabClass: "text-white bg-amber-500 shadow-md",
          inactiveTabClass: "text-gray-500 hover:text-amber-600",
          inputClass: "text-gray-800 bg-white border-gray-200 focus:border-amber-500 focus:ring-amber-500/20",
          linkClass: "text-amber-600 hover:text-amber-700",
          iconColor: "text-amber-500",
        };
      default: // customer
        return {
          pageBg: "bg-gradient-to-br from-blue-50 via-indigo-50/30 to-sky-50",
          cardClass: "card-customer shadow-2xl shadow-blue-900/5",
          titleGradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
          buttonClass: "btn-customer shadow-lg shadow-blue-500/20",
          activeTabClass: "text-white bg-blue-500 shadow-md",
          inactiveTabClass: "text-slate-500 hover:text-blue-600",
          inputClass: "text-slate-700 bg-white border-blue-100 focus:border-blue-500 focus:ring-blue-500/20",
          linkClass: "text-blue-600 hover:text-blue-700",
          iconColor: "text-blue-500",
        };
    }
  };

  const theme = getTheme(role);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme.pageBg} relative`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-700 ${role === 'rider' ? 'bg-teal-300' : role === 'admin' ? 'bg-amber-100' : 'bg-blue-200'}`} />
        <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors duration-700 ${role === 'rider' ? 'bg-emerald-200' : role === 'admin' ? 'bg-gray-200' : 'bg-indigo-200'}`} />
      </div>

      <Card className={`w-full max-w-md relative z-10 transition-all duration-300 ${theme.cardClass}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 ${theme.titleGradient}`}>
            OnTheGo
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {role === 'admin' ? 'Admin Portal' : role === 'rider' ? 'Partner App' : 'Welcome Back!'}
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex p-1.5 bg-slate-100/80 rounded-xl mb-8 relative border border-slate-200/50">
          {/* Animated Slider Background already implicitly handled by tab styles or we can simplify to just buttons for stability */}
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-all duration-300 ${role === r.id ? theme.activeTabClass : theme.inactiveTabClass
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
            placeholder={role === 'admin' ? "admin@onthego.com" : "you@example.com"}
            icon={Mail}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`transition-all duration-300 ${theme.inputClass}`}
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
              className={`transition-all duration-300 ${theme.inputClass}`}
            />
            <div className="flex justify-end">
              <a
                href="#"
                className={`text-xs font-semibold transition-colors duration-300 ${theme.linkClass}`}
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" variant="ghost" className={`mt-8 w-full py-3 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 ${theme.buttonClass}`}>
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
            <ArrowRight size={20} className="ml-2 inline-block" />
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          {role === "admin" ? (
            <span className="font-semibold text-slate-700">Contact IT Support</span>
          ) : (
            <Link
              to={role === "rider" ? "/rider-signup" : "/signup"}
              className={`font-semibold transition-colors duration-300 ${theme.linkClass}`}
            >
              Sign up as {role === "rider" ? "Rider" : "Customer"}
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;
