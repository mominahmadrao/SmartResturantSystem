import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // Expanded Mock Data (15 Items)
  const mockMenuData = [
    // --- Burgers ---
    { id: 1, name: "Zinger Burger", description: "Crispy chicken fillet with secret sauce.", price: 450, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", category: "Burgers" },
    { id: 2, name: "Beef Smash", description: "Juicy beef patty with caramelized onions.", price: 650, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", category: "Burgers" },
    { id: 3, name: "Club Sandwich", description: "Triple layered toasted goodness.", price: 550, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500", category: "Burgers" },
    { id: 4, name: "Jalapeno Crunch", description: "Spicy jalapeno sauce with crispy coating.", price: 550, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500", category: "Burgers" },
    { id: 5, name: "Mushroom Swiss", description: "Grilled mushroom and swiss cheese melt.", price: 700, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", category: "Burgers" },

    // --- Pizza ---
    { id: 11, name: "Chicken Tikka Pizza", description: "Spicy tikka chunks with onions and cheese.", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500", category: "Pizza" },
    { id: 12, name: "Pepperoni Feast", description: "Loaded with pepperoni slices.", price: 1300, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500", category: "Pizza" },
    { id: 13, name: "Fajita Sensation", description: "Mexican style chicken and peppers.", price: 1250, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", category: "Pizza" },
    { id: 14, name: "Cheese Slice", description: "Large NY Style cheese slice.", price: 300, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500", category: "Pizza" },
    { id: 15, name: "BBQ Chicken", description: "Smoky BBQ sauce and grilled chicken.", price: 1400, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", category: "Pizza" },

    // --- Drinks ---
    { id: 6, name: "Coca Cola", description: "Chilled 500ml bottle.", price: 100, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", category: "Drinks" },
    { id: 7, name: "Mint Margarita", description: "Refreshing mint and lemon blend.", price: 250, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOwMmJ9UBb6nqUTou-ENQGT_Qx8JR3T6KKSw&s", category: "Drinks" },
    { id: 8, name: "Strawberry Shake", description: "Fresh strawberry pulp with milk.", price: 300, image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500", category: "Drinks" },
    { id: 9, name: "Fresh Lime", description: "Sparkling lemon soda with mint.", price: 150, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500", category: "Drinks" },
    { id: 10, name: "Mineral Water", description: "Pure mineral water 1.5L.", price: 80, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500", category: "Drinks" },
  ];

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      setMenuItems(mockMenuData.filter(item => item.category === selectedCategory));
    } else {
      setMenuItems(mockMenuData);
    }
  }, [selectedCategory]);
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="container min-h-screen py-6">
      <h1 className="menu-title text-4xl font-bold mb-8 mt-4 text-[#2E2E2E] flex items-center justify-center gap-2">
        {selectedCategory ? (
          <>
            <span className="text-[hsl(var(--primary))]">{selectedCategory}</span> Menu
          </>
        ) : "Our Menu"}
      </h1>

      {menuItems.length === 0 ? (
        <p style={{ textAlign: 'center' }} className="text-gray-500">Loading menu...</p>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className={`card-img w-full h-40 ${item.name === "Mineral Water" ? "object-contain p-2" : "object-cover"}`}
              />
              <div className="card-content p-6">
                <div className="card-header flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#2E2E2E]">{item.name}</h3>
                  <span className="price font-bold text-[hsl(var(--primary))]">{item.price} Rs</span>
                </div>
                <p className="description text-gray-500 text-sm mb-4 min-h-[40px]">{item.description}</p>
                <button
                  className="w-full bg-[hsl(var(--primary))] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Floating Proceed to Cart Button */}
      {cart && cart.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
          <button
            onClick={() => navigate('/cart')}
            className="bg-[hsl(var(--primary))] text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg hover:brightness-110 transition-all flex items-center gap-2 animate-bounce-short"
          >
            Proceed to Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;