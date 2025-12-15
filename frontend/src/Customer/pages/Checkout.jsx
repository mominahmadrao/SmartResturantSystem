import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // 1. Create Mock Order Object (Simulating Backend creation)
    const newOrder = {
      id: Date.now(), // Unique ID
      displayId: `ORD-${Math.floor(Math.random() * 10000)}`,
      status: 'assigned', // Initial status for Rider
      restaurant: {
        name: "Seerat Restaurant",
        address: "123 Food Street, Lahore",
        lat: 31.5204,
        lng: 74.3587
      },
      customer: {
        name: "Momin (You)", // Mock User
        address: "456 Home Lane, Johar Town",
        lat: 31.4697,
        lng: 74.2728
      },
      items: cart,
      total: getCartTotal(),
      timestamp: new Date().toISOString()
    };

    // 2. Save to "Database" (LocalStorage)
    const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    localStorage.setItem('mock_orders', JSON.stringify([newOrder, ...existingOrders]));

    // 3. User Feedback
    alert("Order placed successfully! \nIt has been assigned to a Rider.");
    clearCart();
    navigate("/order-tracking");
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <h4>{item.name}</h4>
              <p>
                Rs {item.price} × {item.quantity} ={" "}
                <strong>Rs {item.price * item.quantity}</strong>
              </p>
            </div>
          ))}

          <h3>Total: Rs {getCartTotal()}</h3>

          <button
            onClick={handlePlaceOrder}
            style={{
              background: "#28a745",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
