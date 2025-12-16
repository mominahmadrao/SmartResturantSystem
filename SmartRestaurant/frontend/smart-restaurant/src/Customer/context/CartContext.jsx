// We make a separate file for cart context to store cart data and functions in one place.
// It acts like a global storage for the cart.
// Inside it, we have:
// cart → items in the cart
// addToCart() → add item
// removeFromCart() → remove item
// clearCart() → empty the cart
import { createContext, useState } from "react";
// 1. Create the Context AND Export it
export const CartContext = createContext();
//We will use cartContext in cartProvider that wrap components
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // keep it temporary in memory

  const addToCart = (item) => {
    // Backend uses item_id
    const exist = cart.find((i) => i.item_id === item.item_id);
    if (exist) {
      setCart(
        cart.map((i) =>
          i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const exist = cart.find((i) => i.item_id === id);
    if (exist.quantity > 1) {
      setCart(
        cart.map((i) =>
          i.item_id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      setCart(cart.filter((i) => i.item_id !== id));
    }
  };

  const clearCart = () => setCart([]);
  // ✅ Add this function
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
