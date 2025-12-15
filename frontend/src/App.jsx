import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './Rider/components/ThemeProvider'; // Rider Theme Provider

// --- Admin / Auth Imports ---
import Login from "./Admin/pages/Login";
import Signup from "./Admin/pages/Signup";
import RiderSignup from "./Admin/pages/RiderSignup";
import Analytics from "./Admin/pages/admin/Analytics";

// --- Customer Imports ---
import CustomerLayout from './Customer/components/CustomerLayout';
import Home from './Customer/pages/Home';
import Menu from './Customer/pages/Menu';
import Cart from './Customer/pages/Cart';
import Checkout from './Customer/pages/Checkout';
import OrderTracking from './Customer/pages/OrderTracking';
import OrderHistory from './Customer/pages/OrderHistory';

// --- Rider Imports ---
import RiderLayout from './Rider/components/RiderLayout';
import RiderDashboard from './Rider/pages/RiderDashboard';
import RiderOrderDetails from './Rider/pages/RiderOrderDetails';
import RiderHistory from './Rider/pages/RiderHistory';
import RiderProfile from './Rider/pages/RiderProfile';
import RiderEarnings from './Rider/pages/RiderEarnings';

import './App.css'; // Unified CSS

export default function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="smart-rider-theme">
            <Router>
                <Routes>
                    {/* --- Auth Routes (Entry Point) --- */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/rider-signup" element={<RiderSignup />} />

                    {/* --- Admin Routes --- */}
                    <Route path="/admin/analytics" element={<Analytics />} />

                    {/* --- Customer Routes --- */}
                    <Route path="/home" element={<CustomerLayout />}>
                        <Route index element={<Home />} />
                        <Route path="menu" element={<Menu />} /> {/* Note: accessible via /home/menu now? No, Outlet renders at /home. Sub-routes need relative path? 
                                                                    Wait, if parent is /home, child path "menu" becomes /home/menu.
                                                                    This might break existing links in CustomerLayout if they are absolute like "/menu".
                                                                    Let's keep Customer Routes at root IF possible, OR update CustomerLayout links.
                                                                    Plan said: "Move standard Customer routes... /home".
                                                                    If I make parent /home, then child "menu" is /home/menu.
                                                                    BUT CustomerLayout has <Link to="/menu">.
                                                                    To avoid rewriting all links, I will map the Customer Layout to WRAP the old paths?
                                                                    No, user wants flow "Login -> Home".
                                                                    So /home is distinct.
                                                                    I should stick to:
                                                                    - /login
                                                                    - /home (Customer Home)
                                                                    - /menu (Customer Menu)
                                                                    - /cart ...
                                                                    This means CustomerLayout wraps them?
                                                                    Let's try to keep them as top level routes but redirect / to /login?
                                                                    BUT user said: "if not then ... go to Home Page".
                                                                    Let's effectively make the Customer App live at root path structure BUT / redirects to Login if no auth?
                                                                    For now, let's follow the plan:
                                                                    / -> redirect login
                                                                    /home -> Landing
                                                                    /menu -> Menu
                                                                    ...
                                                                    This usually implies /home is a sibling to /menu.
                                                                    Let's check CustomerLayout again. It has <Outlet>.
                                                                    So if I put:
                                                                    <Route element={<CustomerLayout />}>
                                                                        <Route path="/home" element={<Home />} />
                                                                        <Route path="/menu" element={<Menu />} />
                                                                        ...
                                                                    </Route>
                                                                    This preserves the paths like /menu.
                                                                    And / just redirects.
                                                                    This is cleaner and doesn't break links.
                        */}
                    </Route>

                    {/* Customer Routes with Layout wrapper */}
                    <Route element={<CustomerLayout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/history" element={<OrderHistory />} />
                        <Route path="/order-tracking" element={<OrderTracking />} />
                    </Route>


                    {/* --- Rider Routes --- */}
                    <Route path="/rider" element={<RiderLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<RiderDashboard />} />
                        <Route path="history" element={<RiderHistory />} />
                        <Route path="earnings" element={<RiderEarnings />} />
                        <Route path="profile" element={<RiderProfile />} />
                        <Route path="orders/:id" element={<RiderOrderDetails />} />
                    </Route>

                    {/* 404 Fallback */}
                    <Route path="*" element={<div className="p-10 text-center"><h1>404 - Page Not Found</h1></div>} />

                </Routes>
            </Router>
        </ThemeProvider>
    );
}
