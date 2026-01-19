import { useEffect, useState } from "react";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, LogOut, Clock, Calendar, 
  MapPin, Coffee, TrendingUp, CheckCircle2, AlertCircle, Trees 
} from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function EmployeeAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState(null);
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Today's Leave Status
      const leaveRes = await API.get("/leaves/check-today");
      setIsOnLeave(leaveRes.data.onLeave);

      // 2. Fetch Personal Attendance Records
      const res = await API.get("/attendance/my");
      setRecords(res.data);

      // 3. Find Today's specific record
      const todayDate = new Date().toISOString().slice(0, 10);
      const todayRecord = res.data.find(r => r.date === todayDate);
      setToday(todayRecord);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleCheckIn = async () => {
    try {
      await API.post("/attendance/check-in");
      fetchAttendanceData();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await API.post("/attendance/check-out");
      fetchAttendanceData();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  // 7 PM Auto-close detection for UI styling
  const isAfterSeven = currentTime.getHours() >= 19;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time & Attendance</h1>
          <p className="text-slate-500 font-medium italic">
            {isAfterSeven ? "Shift hours have concluded (07:00 PM)" : "Punctuality is the soul of business."}
          </p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Time</p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner 
            ${isAfterSeven && !today?.checkOut ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <Clock size={24} className={!today?.checkOut ? "animate-pulse" : ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: INTERACTIVE CONSOLE --- */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <TrendingUp size={120} />
            </div>

            <h2 className="text-xl font-black text-slate-800 mb-6">Today's Status</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${today ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <LogIn size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Clock In</p>
                  <p className="text-lg font-black text-slate-700">
                    {today?.checkIn ? new Date(today.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${today?.checkOut ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <LogOut size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Clock Out</p>
                  <p className="text-lg font-black text-slate-700">
                    {today?.checkOut ? new Date(today.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {/* 1. BLINKING LEAVE STATE */}
                {isOnLeave ? (
                  <motion.div
                    key="leave-mode"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-full py-8 rounded-[2rem] bg-rose-50 border-2 border-dashed border-rose-200 text-rose-600 font-black text-center flex flex-col items-center gap-3"
                  >
                    <Trees size={40} strokeWidth={2.5} />
                    <div className="space-y-1 text-center">
                       <p className="text-xl uppercase tracking-tighter">You are on Leave</p>
                       <p className="text-[10px] font-bold opacity-70 italic">ENJOY YOUR TIME OFF</p>
                    </div>
                  </motion.div>
                ) : 
                
                /* 2. CHECK-IN BUTTON */
                !today ? (
                  <motion.button
                    key="btn-in"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={handleCheckIn}
                    className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <MapPin size={20} /> Punch In
                  </motion.button>
                ) : 
                
                /* 3. CHECK-OUT BUTTON */
                !today.checkOut ? (
                  <motion.button
                    key="btn-out"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={handleCheckOut}
                    className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Coffee size={20} /> Clock Out
                  </motion.button>
                ) : 
                
                /* 4. COMPLETED STATE */
                (
                  <div className="w-full py-5 rounded-[2rem] bg-slate-50 text-slate-400 font-black text-lg flex items-center justify-center gap-3 border border-slate-100">
                    <CheckCircle2 size={20} /> Shift Closed
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT: ATTENDANCE HISTORY TABLE --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Calendar size={20} className="text-emerald-600" /> Recent Activity
                </h2>
             </div>
             
             <div className="overflow-x-auto">
               {loading ? (
                 <div className="flex flex-col justify-center items-center py-24 gap-3">
                   <ClipLoader color="#10b981" size={30} />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Logs...</span>
                 </div>
               ) : (
                 <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">Time Slot</th>
                        <th className="px-8 py-5 text-center">Hours</th>
                        <th className="px-8 py-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {records.length > 0 ? records.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5 font-bold text-slate-700 text-sm">{r.date}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                                {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                              </span>
                              <span className="text-slate-300">→</span>
                              <span className="text-xs font-black text-slate-500">
                                {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "..."}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center font-black text-slate-700 text-sm">
                            {r.workingHours || 0} <span className="text-[10px] text-slate-400">h</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider
                              ${r.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                r.status === 'HALF_DAY' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                            No attendance logs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                 </table>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}