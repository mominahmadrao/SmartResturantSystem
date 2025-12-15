import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowLeft,
  Bike,
  CreditCard,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const RiderSignup = () => {
  const [step, setStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      console.log("Rider Signup Complete");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 z-0" />

      <Card className="w-full max-w-md relative z-10 glass border-t-4 border-t-secondary-500">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-slate-500 hover:text-secondary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 mb-4">
            <Bike size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Become a Rider</h1>
          <p className="text-slate-500 mt-2">
            Deliver happiness and earn money.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Jane" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="jane@example.com"
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
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                Vehicle Information
              </h3>
              <Input
                label="Vehicle Type"
                placeholder="e.g. Motorcycle, Bicycle"
                icon={Bike}
              />
              <Input label="License Plate" placeholder="ABC-1234" />
              <Input
                label="Driver's License ID"
                placeholder="DL-12345678"
                icon={CreditCard}
              />
            </div>
          )}

          <div className="pt-4 flex gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-700 hover:to-secondary-600 shadow-secondary-500/30"
            >
              {step === 1 ? "Next Step" : "Complete Registration"}
            </Button>
          </div>
        </form>

        <div className="mt-4 flex justify-center gap-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 1 ? "w-8 bg-secondary-500" : "w-2 bg-slate-200"
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 2 ? "w-8 bg-secondary-500" : "w-2 bg-slate-200"
            }`}
          />
        </div>
      </Card>
    </div>
  );
};

export default RiderSignup;
