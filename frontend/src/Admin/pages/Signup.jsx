import React from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Customer Signup");
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
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            icon={Mail}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            icon={Phone}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            icon={Lock}
          />

          <Button type="submit" className="mt-6">
            Create Account
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
