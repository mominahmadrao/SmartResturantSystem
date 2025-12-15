import { useState, useEffect } from "react";

export default function OrderTracking() {
  const [status, setStatus] = useState("Order Placed");

  useEffect(() => {
    const steps = ["Preparing", "Out for Delivery", "Delivered"];
    let index = 0;
    const interval = setInterval(() => {
      if (index < steps.length) {
        setStatus(steps[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000); // updates every 2 sec for demo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2>Order Tracking</h2>
      <p>Your order status: <strong>{status}</strong></p>
    </div>
  );
}
