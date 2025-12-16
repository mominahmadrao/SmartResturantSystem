import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../../api/axios";
import Card from "../components/ui/Card";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "customer",
      });
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 z-0" />

      <Card className="w-full max-w-md relative z-10 glass">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">
            Join us to order delicious food!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            icon={Phone}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="mt-6" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-700"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
