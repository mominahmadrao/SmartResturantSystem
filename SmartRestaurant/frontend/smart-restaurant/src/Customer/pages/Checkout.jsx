import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      const payload = {
        items: cart.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      };

      // Add trailing slash to avoid 307 redirect which breaks CORS/Auth
      const response = await api.post("/orders/", payload);

      alert("Order placed successfully!");
      clearCart();
      // Pass the new order ID to the tracking page
      navigate("/order-tracking", {
        state: { orderId: response.data.order_id },
      });
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.item_id} className="cart-item">
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
