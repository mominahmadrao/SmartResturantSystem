import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  /* mock data removed */
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get("/menu");
        if (selectedCategory) {
          setMenuItems(
            response.data.filter(
              (item) => item.category_name === selectedCategory
            )
          );
        } else {
          setMenuItems(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedCategory]);
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="container min-h-screen py-6">
      <h1 className="menu-title text-4xl font-bold mb-8 mt-4 text-[#2E2E2E] flex items-center justify-center gap-2">
        {selectedCategory ? (
          <>
            <span className="text-[hsl(var(--primary))]">
              {selectedCategory}
            </span>{" "}
            Menu
          </>
        ) : (
          "Our Menu"
        )}
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }} className="text-gray-500">
          Loading menu...
        </p>
      ) : menuItems.length === 0 ? (
        <p style={{ textAlign: "center" }} className="text-gray-500">
          No items found.
        </p>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.item_id}
              className="card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <img
                src={item.image}
                alt={item.name}
                className={`card-img w-full h-40 ${
                  item.name === "Mineral Water"
                    ? "object-contain p-2"
                    : "object-cover"
                }`}
              />
              <div className="card-content p-6">
                <div className="card-header flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#2E2E2E]">
                    {item.name}
                  </h3>
                  <span className="price font-bold text-[hsl(var(--primary))]">
                    {item.price} Rs
                  </span>
                </div>
                <p className="description text-gray-500 text-sm mb-4 min-h-[40px]">
                  {item.description}
                </p>
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
            onClick={() => navigate("/cart")}
            className="bg-[hsl(var(--primary))] text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg hover:brightness-110 transition-all flex items-center gap-2 animate-bounce-short"
          >
            Proceed to Cart (
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items)
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
