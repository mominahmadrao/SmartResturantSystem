import { riderApi } from '../services/riderApi';
import { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronRight, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function RiderHistory() {
    const navigate = useNavigate();
    // Using fake data for history as the API mock might not have enough "past" data
    const [history, setHistory] = useState([
        { id: 'ORD-7711', date: 'Yesterday, 2:30 PM', restaurant: 'Pizza Hut', amount: 18.00, status: 'delivered', address: '101 Pine St' },
        { id: 'ORD-7710', date: 'Yesterday, 1:15 PM', restaurant: 'Subway', amount: 12.50, status: 'delivered', address: '55 Maple Ave' },
        { id: 'ORD-7709', date: 'Dec 10, 8:45 PM', restaurant: 'Taco Bell', amount: 22.10, status: 'delivered', address: '88 Oak Dr' },
        { id: 'ORD-7708', date: 'Dec 10, 7:20 PM', restaurant: 'Burger King', amount: 15.30, status: 'cancelled', address: '12 Top Rd' },
        { id: 'ORD-7707', date: 'Dec 09, 1:00 PM', restaurant: 'Starbucks', amount: 8.50, status: 'delivered', address: 'Admin Block' },
    ]);

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-foreground mb-6">Order History</h1>

            <div className="space-y-4">
                {history.map((order) => (
                    <div
                        key={order.id}
                        className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between hover:bg-accent/30 transition-colors cursor-pointer group"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-bold text-foreground truncate">{order.restaurant}</h3>
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                                    order.status === 'delivered' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-secondary mb-2">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{order.date}</span>
                                <span className="mx-2">•</span>
                                <span className="font-medium text-foreground">${order.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center text-xs text-secondary truncate">
                                <MapPin className="w-3 h-3 mr-1" />
                                {order.address}
                            </div>
                        </div>

                        <div className="ml-4">
                            <button className="p-2 rounded-full bg-accent text-secondary group-hover:text-foreground transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="text-primary text-sm font-medium hover:underline">Load More</button>
            </div>
        </div>
    );
}
