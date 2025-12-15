import { User, Mail, Phone, Bike, Star, Award, Shield, ChevronRight, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RiderProfile() {
    return (
        <div className="pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-purple-600 p-6 pt-10 pb-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center text-3xl font-bold shadow-xl">
                        MJ
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Momin Jawad</h1>
                        <div className="flex items-center text-blue-100 text-sm mt-1">
                            <Shield className="w-4 h-4 mr-1 text-yellow-300" />
                            <span className="font-medium bg-white/10 px-2 py-0.5 rounded-full border border-white/10">Gold Member</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-10 relative z-20 space-y-6">
                {/* Stats Grid */}
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Rating</div>
                        <div className="text-xl font-bold text-foreground flex items-center justify-center">
                            4.9 <Star className="w-4 h-4 text-yellow-500 ml-1 fill-yellow-500" />
                        </div>
                    </div>
                    <div className="border-l border-border">
                        <div className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Orders</div>
                        <div className="text-xl font-bold text-foreground">1.2k</div>
                    </div>
                    <div className="border-l border-border">
                        <div className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Yrs</div>
                        <div className="text-xl font-bold text-foreground">2.5</div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground px-1">Personal Info</h3>
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-border">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-accent rounded-lg text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-secondary">Email</p>
                                    <p className="text-sm font-medium text-foreground">rider@example.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-accent rounded-lg text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-secondary">Phone</p>
                                    <p className="text-sm font-medium text-foreground">+92 321 1234567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground px-1">Vehicle Details</h3>
                    <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary">
                                <Bike className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">Honda CG 125</h4>
                                <p className="text-xs text-secondary">Red • LEA-1234</p>
                            </div>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">Active</span>
                    </div>
                </div>

                {/* Settings / Menu */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden mt-6">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-red-500/5 transition-colors text-left text-red-500">
                        <div className="flex items-center space-x-3">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
