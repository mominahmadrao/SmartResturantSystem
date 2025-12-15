import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { riderApi } from '../services/riderApi';
import { useRiderLocation } from '../hooks/useRiderLocation';
import RiderMap from '../components/RiderMap';
import { ArrowLeft, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RiderOrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { location: riderLocation } = useRiderLocation();

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await riderApi.getOrderDetails(id);
                setOrder(res.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const updateStatus = async (status) => {
        // Optimistic update
        setOrder(prev => ({ ...prev, status }));
        await riderApi.updateOrderStatus(id, status);
    };

    if (loading) return <div className="h-screen bg-background flex items-center justify-center text-secondary">Loading details...</div>;
    if (!order) return <div className="h-screen bg-background flex items-center justify-center text-red-400">Order not found</div>;

    return (
        <div className="h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Top Bar - Absolute */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 pointer-events-auto hover:bg-black/60 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 text-xs font-bold border border-white/10">
                    {order.status === 'assigned' ? 'PICKUP' : order.status === 'picked_up' ? 'DELIVERY' : 'DONE'}
                </div>
            </div>

            {/* Map Section - Takes ~45% height */}
            <div className="h-[45%] w-full relative bg-accent z-0">
                <RiderMap
                    restaurant={order.restaurant}
                    customer={order.customer}
                    riderLocation={riderLocation}
                    className="h-full w-full"
                />
            </div>

            {/* Bottom Sheet - Details */}
            <div className="flex-1 bg-background -mt-6 rounded-t-3xl border-t border-white/10 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col">
                <div className="w-12 h-1.5 bg-accent rounded-full mx-auto mt-3 mb-6 opacity-50" />

                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                {order.status === 'assigned' ? order.restaurant.name : order.customer.name}
                            </h2>
                            <div className="flex items-center text-secondary text-sm">
                                <MapPin className="w-4 h-4 mr-1 text-primary" />
                                <span className="truncate max-w-[200px]">
                                    {order.status === 'assigned' ? order.restaurant.address : order.customer.address}
                                </span>
                            </div>
                        </div>
                        <button className="p-3 bg-accent rounded-full text-foreground hover:bg-accent-hover transition-colors border border-border">
                            <Phone className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 flex items-center justify-center bg-accent text-xs font-bold rounded mr-3 text-foreground">
                                            {item.quantity}x
                                        </span>
                                        <span className="text-foreground text-sm">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-medium text-foreground">Total to pay</span>
                            <span className="text-xl font-bold text-foreground">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Button Fixed at Bottom */}
                <div className="p-4 bg-background border-t border-border">
                    {order.status === 'assigned' && (
                        <button
                            onClick={() => updateStatus('picked_up')}
                            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all text-center flex items-center justify-center space-x-2"
                        >
                            <span>Swipe to Start Delivery</span>
                        </button>
                    )}
                    {order.status === 'picked_up' && (
                        <button
                            onClick={() => updateStatus('delivered')}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-center flex items-center justify-center space-x-2"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            <span>Complete Delivery</span>
                        </button>
                    )}
                    {order.status === 'delivered' && (
                        <div className="w-full py-4 bg-accent/50 border border-emerald-500/20 text-emerald-500 font-bold rounded-xl text-center">
                            Order Completed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
