import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Ticket, CalendarCheck, Briefcase, TrendingUp, 
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, MoreVertical 
} from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, CartesianGrid, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from "recharts";

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function AdminDashboard() {
  // --- DATA SECTIONS ---
  const performanceData = [
    { subject: 'Speed', A: 120, fullMark: 150 },
    { subject: 'Reliability', A: 98, fullMark: 150 },
    { subject: 'Quality', A: 86, fullMark: 150 },
    { subject: 'Design', A: 99, fullMark: 150 },
    { subject: 'Logic', A: 85, fullMark: 150 },
  ];

  const projectGrowth = [
    { name: "Jan", uv: 4000 }, { name: "Feb", uv: 3000 },
    { name: "Mar", uv: 5000 }, { name: "Apr", uv: 2780 },
    { name: "May", uv: 1890 }, { name: "Jun", uv: 4390 },
  ];

  const activities = [
    { id: 1, user: "Amit Sharma", action: "Resolved Ticket #442", time: "2 mins ago", icon: CheckCircle2, color: "text-emerald-500" },
    { id: 2, user: "Sonal Gupta", action: "Applied for Leave", time: "1 hour ago", icon: Clock, color: "text-amber-500" },
    { id: 3, user: "System", action: "Server Reboot Successful", time: "3 hours ago", icon: AlertCircle, color: "text-blue-500" },
  ];

  const COLORS = ["#6366f1", "#f43f5e", "#10b981"];

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 font-sans text-slate-900"
    >
      {/* 🔹 HEADER */}
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-10">
        <div>
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Management Console</span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mt-1">Global Overview</h1>
        </div>
        <div className="hidden md:flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">Export Report</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Create New Task</button>
        </div>
      </motion.div>

      {/* 🔹 4 MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Revenue", val: "$42.5k", icon: TrendingUp, up: "+14%", color: "blue" },
          { label: "Active Users", val: "1,240", icon: Users, up: "+8%", color: "indigo" },
          { label: "Task Done", val: "85%", icon: CheckCircle2, up: "+2%", color: "emerald" },
          { label: "Tickets", val: "12", icon: Ticket, up: "-3%", color: "rose" },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem]">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 mb-4`}>
                  <s.icon size={24} />
                </div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-tight">{s.label}</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-black mt-1">{s.val}</h2>
                  <span className="text-emerald-500 text-xs font-bold">{s.up}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 🔹 MIDDLE SECTION: BIG AREA CHART & RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-none shadow-sm rounded-[2rem] h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black">Project Growth Pulse</CardTitle>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectGrowth}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="uv" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUv)" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm rounded-[2rem] h-full">
            <CardHeader><CardTitle className="text-xl font-black">Team Efficiency</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Radar name="Team A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 🔹 BOTTOM SECTION: THREE COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm rounded-[2rem] h-full">
            <CardHeader><CardTitle className="text-xl font-black">Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-4">
                  <div className={`p-2 rounded-xl bg-slate-50 ${act.color}`}><act.icon size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{act.user}</p>
                    <p className="text-xs text-slate-500 font-medium">{act.action}</p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{act.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Salary Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm rounded-[2rem] h-full">
            <CardHeader><CardTitle className="text-xl font-black">Salary Expenses</CardTitle></CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectGrowth}>
                  <Bar dataKey="uv" fill="#f43f5e" radius={[10, 10, 10, 10]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ticket Donut */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm rounded-[2rem] h-full">
            <CardHeader><CardTitle className="text-xl font-black">Support Load</CardTitle></CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{v:40},{v:30},{v:30}]} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="v">
                    {COLORS.map((c, i) => <Cell key={i} fill={c} cornerRadius={10} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4">
                <span className="text-[10px] font-bold text-slate-400">● OPEN</span>
                <span className="text-[10px] font-bold text-slate-400">● CLOSED</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}