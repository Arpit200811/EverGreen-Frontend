import { useEffect, useState } from "react";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, LogOut, Clock, Calendar, 
  MapPin, Coffee, TrendingUp, CheckCircle2 
} from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function EmployeeAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await API.get("/attendance/my");
      setRecords(res.data);
      const todayDate = new Date().toISOString().slice(0, 10);
      const todayRecord = res.data.find(r => r.date === todayDate);
      setToday(todayRecord);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleCheckIn = async () => {
    await API.post("/attendance/check-in");
    fetchAttendance();
  };

  const handleCheckOut = async () => {
    await API.post("/attendance/check-out");
    fetchAttendance();
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen font-sans">
      
      {/* ---------- HEADER SECTION ---------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time & Attendance</h1>
          <p className="text-slate-500 font-medium italic">Punctuality is the soul of business.</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Time</p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Clock size={24} className="animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ---------- LEFT: CHECK-IN CONSOLE ---------- */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <TrendingUp size={120} />
            </div>

            <h2 className="text-xl font-black text-slate-800 mb-6">Today's Shift</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${today ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <LogIn size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Check In</p>
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
                  <p className="text-xs font-bold text-slate-400 uppercase">Check Out</p>
                  <p className="text-lg font-black text-slate-700">
                    {today?.checkOut ? new Date(today.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {!today ? (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={handleCheckIn}
                    className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <MapPin size={20} /> Check In Now
                  </motion.button>
                ) : !today.checkOut ? (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={handleCheckOut}
                    className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Coffee size={20} /> Finish Shift
                  </motion.button>
                ) : (
                  <div className="w-full py-5 rounded-[2rem] bg-slate-100 text-slate-400 font-black text-lg flex items-center justify-center gap-3 border border-slate-200">
                    <CheckCircle2 size={20} /> Shift Completed
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ---------- RIGHT: LOG HISTORY ---------- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <h2 className="text-xl font-black text-slate-800">Attendance Log</h2>
               <div className="flex gap-2">
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Present</div>
                  <div className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full uppercase">Late</div>
               </div>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              {loading ? (
                <div className="flex justify-center py-20"><ClipLoader color="#10b981" /></div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                      <th className="p-6">Date</th>
                      <th className="p-6">Timeline</th>
                      <th className="p-6">Total Hours</th>
                      <th className="p-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {records.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="font-bold text-slate-700">{r.date}</span>
                          </div>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded">
                                {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                              </span>
                              <div className="w-4 h-[2px] bg-slate-200" />
                              <span className="text-xs font-black text-slate-500">
                                {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "..."}
                              </span>
                           </div>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-black text-slate-700">{r.workingHours || "0"} <span className="text-slate-400 font-bold text-xs uppercase">Hrs</span></span>
                        </td>
                        <td className="p-6">
                          <span className={`
                            px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider
                            ${r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}
                          `}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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