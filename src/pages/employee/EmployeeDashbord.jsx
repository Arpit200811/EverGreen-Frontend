import React, { useState, useEffect } from "react";
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
  
  // --- Live Tracking Logic ---
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const toggleTracking = () => {
    if (isTracking) {
      // Stop Tracking
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setIsTracking(false);
      toast.success("Live tracking stopped.");
    } else {
      // Start Tracking
      if (!("geolocation" in navigator)) {
        toast.error("Geolocation is not supported by your browser.");
        return;
      }
      
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        (error) => {
          console.error("Tracking error:", error);
          toast.error("Unable to retrieve location.");
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      
      setWatchId(id);
      setIsTracking(true);
      toast.success("Live tracking started!");
    }
  };
const updateLocation = async (lat, lng, accuracy) => {
  try {
    await API.put("/users/update-location", { coordinates: [lng, lat] });
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
  useEffect(() => {
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);


  // --- Data ---
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal Insights</h1>
          <p className="text-slate-500 font-medium">Tracking your growth and contributions</p>
        </div>
        
        <div className="flex gap-4">
            {/* Live Tracking Toggle Button */}
            <button 
                onClick={toggleTracking}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
                    isTracking 
                    ? "bg-rose-500 text-white shadow-rose-200" 
                    : "bg-slate-900 text-white shadow-slate-200 hover:bg-emerald-600"
                }`}
            >
                {isTracking ? <div className="w-3 h-3 bg-white rounded-full animate-pulse"/> : <MapPin size={20} />}
                {isTracking ? "Stop Tracking" : "Start Duty"}
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
           initial={{ opacity: 0, y: -20 }} 
           animate={{ opacity: 1, y: 0 }}
           className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800"
         >
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-bold">Live Tracking Active: Your location is being broadcasted to Admin.</span>
         </motion.div>
       )}

      {/* 🔹 KEY PERFORMANCE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Completed Tickets", val: "328", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Attendance Avg", val: "94.2%", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Current Salary", val: "₹30,000", icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
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

      {/* 🔹 MAIN COMBINED CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-black">Performance & Earnings</CardTitle>
              <p className="text-xs text-slate-400 font-bold">Monthly trend for Tickets and Salary</p>
            </div>
            <div className="flex gap-4 text-[10px] font-black uppercase">
               <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500"/> Tickets</span>
               <span className="flex items-center gap-1 text-purple-500"><div className="w-2 h-2 rounded-full bg-purple-500"/> Salary</span>
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
                <Area 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTickets)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="salary" 
                  stroke="#a855f7" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🔹 LEAVE & ATTENDANCE CIRCLE */}
        <Card className="border-none shadow-sm rounded-[2.5rem]">
          <CardHeader>
            <CardTitle className="text-xl font-black">Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
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
            <div className="w-full space-y-3 mt-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-600">Total Leaves</span>
                <span className="text-sm font-black text-slate-800">22</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-600">Approved Leaves</span>
                <span className="text-sm font-black text-emerald-600">08</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 BOTTOM ROW: RECENT TICKETS & ATTENDANCE LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black text-slate-800">Recent Completed Tickets</CardTitle>
            <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
              <ChevronRight size={18} />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "#TK-992", title: "Cloud migration error fixed", date: "Today", status: "Perfect" },
              { id: "#TK-841", title: "Employee payroll sync issue", date: "Yesterday", status: "Good" },
              { id: "#TK-712", title: "UI improvements for Navbar", date: "3 days ago", status: "Perfect" },
            ].map((ticket, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors cursor-pointer group">
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
           <CardHeader>
              <CardTitle className="text-lg font-black text-slate-800">Weekly Attendance Trend</CardTitle>
           </CardHeader>
           <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="month" hide />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#10b981" radius={[10, 10, 10, 10]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3">
                <Clock className="text-emerald-600" />
                <p className="text-xs font-bold text-emerald-800">You have been 100% punctual this week! Keep it up.</p>
              </div>
           </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}