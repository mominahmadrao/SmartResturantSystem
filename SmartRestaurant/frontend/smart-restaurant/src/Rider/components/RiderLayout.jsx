import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, User, Menu, X, LogOut, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';




export default function RiderLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/rider/dashboard', icon: LayoutDashboard },
        { name: 'Earnings', path: '/rider/earnings', icon: DollarSign },
        { name: 'History', path: '/rider/history', icon: History },
        { name: 'Profile', path: '/rider/profile', icon: User },
        { name: 'Customer View', path: '/', icon: Menu }, // Added Link
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50/20 rider-theme">
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-full shadow-lg"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    <div className="mb-10 px-2">
                        <h1 className="text-xl font-bold tracking-tight text-teal-700">SmartRider</h1>
                        <p className="text-slate-500 text-sm">Delivery App</p>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) => cn(
                                        "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                                        isActive
                                            ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border space-y-2">

                        <button className="flex items-center space-x-3 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors w-full px-4 py-2 text-sm font-medium">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background lg:bg-background/95 transition-all">
                {/* We generally want the dashboard to control its own header, or have a shared one here */}
                <main className="flex-1 relative overflow-auto h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
