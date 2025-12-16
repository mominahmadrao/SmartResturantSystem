import { Link, Outlet } from "react-router-dom";
import "../../App.css"; // Ensure it points to the unified CSS
import Footer from "./Footer";

export default function CustomerLayout() {
  return (
    <div className="customer-app">
      <nav className="navbar">
        <h1>Seerat Restaurant</h1>
        <div className="nav-links">
          <Link to="/home">Home</Link>

          <div className="dropdown">
            <Link to="/menu" className="dropdown-trigger">
              Menu ▾
            </Link>
            <div className="dropdown-content">
              <Link to="/menu?category=Burgers">🍔 Burgers</Link>
              <Link to="/menu?category=Pizza">🍕 Pizza</Link>
              <Link to="/menu?category=Drinks">🥤 Drinks</Link>
              <div className="h-px bg-gray-100 my-1"></div>
              <Link to="/menu">🍽️ All Items</Link>
            </div>
          </div>
          <Link to="/order-tracking">Track Order</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
