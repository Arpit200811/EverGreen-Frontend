import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, Clock, Calendar, Wallet, Plane, Zap, ChevronRight,
  MapPin, AlertCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  
  // --- States ---
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // --- API Call function ---
  const updateLocation = async (lat, lng, accuracy) => {
    try {
      // 1. Update User Current Status
      await API.put("/users/update-location", { coordinates: [lng, lat] });
      // 2. Log into History (Optional but good for reports)
      await API.post("/location/update", { 
        lat, 
        lng, 
        accuracy, 
        timestampClient: new Date() 
      });
    } catch (err) {
      console.error("Failed to update location", err);
    }
  };

  // --- Tracking Logic (Start) ---
  const startTracking = useCallback(() => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        updateLocation(latitude, longitude, accuracy);
      },
      (error) => {
        console.error("Tracking error:", error);
        if (error.code === 1) toast.error("Please allow location access to continue duty.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    setWatchId(id);
    setIsTracking(true);
    localStorage.setItem("is_on_duty", "true"); // Save state for persistence
  }, []);

  // --- Tracking Logic (Stop) ---
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    localStorage.setItem("is_on_duty", "false"); // Update persistence
  };

  // --- Persistence & Auto-Start Effect ---
  useEffect(() => {
    const isOnDuty = localStorage.getItem("is_on_duty") === "true";
    
    // Agar localstorage mein duty true hai aur tracking abhi chalu nahi hai
    if (isOnDuty && !watchId) {
      startTracking();
      toast.success("Resuming your duty session...");
    }

    return () => {
      // Cleanup on unmount (Optional: often left active in PWAs)
    };
  }, [startTracking, watchId]);

  // --- Manual Toggle Handle ---
  const handleToggleDuty = () => {
    if (isTracking) {
      stopTracking();
      toast.success("Duty Ended.");
    } else {
      startTracking();
      toast.success("Duty Started!");
    }
  };

  // --- Chart Data ---
  const performanceData = [
    { month: "Jan", tickets: 45, attendance: 95, salary: 25000 },
    { month: "Feb", tickets: 52, attendance: 88, salary: 25000 },
    { month: "Mar", tickets: 48, attendance: 100, salary: 28000 },
    { month: "Apr", tickets: 61, attendance: 92, salary: 28000 },
    { month: "May", tickets: 55, attendance: 96, salary: 28000 },
    { month: "Jun", tickets: 67, attendance: 98, salary: 30000 },
  ];

  const leaveData = [
    { name: "Used Leaves", value: 8, color: "#10b981" },
    { name: "Remaining", value: 14, color: "#e2e8f0" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 font-sans"
    >
      {/* 🔹 WELCOME HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight tracking-tight capitalize">
            Hi, {user?.name || "Employee"}!
          </h1>
          <p className="text-slate-500 font-medium">Tracking your growth and contributions</p>
        </div>
        
        <div className="flex gap-4">
            <button 
                onClick={handleToggleDuty}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
                    isTracking 
                    ? "bg-rose-500 text-white shadow-rose-100" 
                    : "bg-slate-900 text-white shadow-slate-200 hover:bg-emerald-600"
                }`}
            >
                {isTracking ? (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        Stop Duty
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        Start Duty
                    </div>
                )}
            </button>

            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hidden sm:flex">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Performance Score</p>
                <p className="text-sm font-black text-emerald-600">9.4 / 10</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Zap size={20} fill="currentColor" />
              </div>
            </div>
        </div>
      </div>

       {isTracking && (
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }} 
           animate={{ opacity: 1, scale: 1 }}
           className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800"
         >
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-bold">Live Tracking Active: Your location is being updated automatically.</span>
         </motion.div>
       )}

      {/* 🔹 KEY PERFORMANCE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Completed Tickets", val: "328", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Attendance Avg", val: "94.2%", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Current Salary", val: `₹${user?.baseSalary || 0}`, icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Available Leaves", val: "14 Days", icon: Plane, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }}>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-800">{stat.val}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 🔹 MAIN CHART & LEAVE CIRCLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-black">Performance & Earnings</CardTitle>
              <p className="text-xs text-slate-400 font-bold">Monthly trend for Tickets and Salary</p>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorTickets)" />
                <Area type="monotone" dataKey="salary" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem]">
          <CardHeader>
            <CardTitle className="text-xl font-black">Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leaveData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {leaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">14</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days Left</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem]">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-800">Recent Completed Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "#TK-992", title: "Cloud migration error fixed", date: "Today", status: "Perfect" },
              { id: "#TK-841", title: "Employee payroll sync issue", date: "Yesterday", status: "Good" },
            ].map((ticket, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{ticket.title}</p>
                    <p className="text-[10px] font-bold text-slate-400">{ticket.id} • {ticket.date}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{ticket.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem]">
            <CardHeader><CardTitle className="text-lg font-black text-slate-800">Weekly Attendance</CardTitle></CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <Bar dataKey="attendance" fill="#10b981" radius={[10, 10, 10, 10]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3">
                <Clock className="text-emerald-600" />
                <p className="text-xs font-bold text-emerald-800">100% punctual this week! Keep it up.</p>
              </div>
            </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}