import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, getCartTotal, addToCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <Link to="/menu">Go to Menu</Link>
      </div>
    );
  }

  return (
    <div className="container min-h-[60vh] py-10">
      <h2 className="text-3xl font-bold mb-8 text-[#2E2E2E]">Your Cart</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.item_id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md"
          >
            {/* Item Info */}
            <div className="flex items-center gap-4">
              {/* Optional: Add Image here if available in item object */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h4 className="text-lg font-bold text-[#2E2E2E]">
                  {item.name}
                </h4>
                <p className="text-gray-500 text-sm">
                  Rs {item.price} per unit
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <span className="font-bold text-lg text-[hsl(var(--primary))] w-24 text-right">
                Rs {item.price * item.quantity}
              </span>

              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                {/* Decrement / Remove */}
                <button
                  onClick={() => removeFromCart(item.item_id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                  title="Remove 1"
                >
                  {item.quantity === 1 ? (
                    <Trash2 size={16} />
                  ) : (
                    <Minus size={16} />
                  )}
                </button>

                <span className="font-bold w-6 text-center text-[#2E2E2E]">
                  {item.quantity}
                </span>

                {/* Increment (Optional nice-to-have) */}
                <button
                  onClick={() => addToCart(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[hsl(var(--primary))] hover:bg-teal-50 hover:text-teal-700 transition-colors shadow-sm"
                  title="Add 1"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-end border-t pt-8">
        <div className="text-right mb-6">
          <span className="text-gray-500 mr-4 text-lg">Total Amount:</span>
          <span className="text-4xl font-bold text-[hsl(var(--primary))]">
            Rs {getCartTotal()}
          </span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-[hsl(var(--primary))] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:brightness-110 transition-all transform hover:-translate-y-1"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
