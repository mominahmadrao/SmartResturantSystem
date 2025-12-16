import { useEffect, useState } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/customer/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Debugging
        setOrders(data);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>Order History</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No past orders found in the database.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Order #</th>
                <th className="px-6 py-3">Restaurant</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.order_number}</td>
                  <td className="px-6 py-4">{order.restaurant_name}</td>
                  <td className="px-6 py-4">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}