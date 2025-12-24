import { useEffect, useState } from "react";
import API from "../../api/axios";
import { ClipLoader } from "react-spinners";
import { 
  Calendar, Clock, Download, Search, Filter, 
  ArrowRightLeft, UserCheck, UserX, Timer 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/attendance/all");
      setRecords(res.data);
      setFilteredRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = records;
    if (searchTerm) {
      result = result.filter((r) => 
        r.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFilter) {
      result = result.filter((r) => r.date === dateFilter);
    }
    setFilteredRecords(result);
  }, [searchTerm, dateFilter, records]);

  const handleExport = () => {
    // Basic CSV export logic can be added here
    alert("Exporting CSV...");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 gap-4">
        <ClipLoader color="#10b981" size={45} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Compiling Logs...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Calendar className="text-emerald-600" size={28} /> Attendance Logs
          </h1>
          <p className="text-slate-500 font-medium">Monitor employee clock-in/out patterns</p>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* --- FILTERS BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search employee..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="date"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 text-slate-600 font-medium"
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-around bg-slate-50 rounded-2xl px-4 py-2">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Total Logs</p>
              <p className="text-lg font-black text-slate-800">{filteredRecords.length}</p>
           </div>
           <div className="w-px h-8 bg-slate-200"></div>
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Active Today</p>
              <p className="text-lg font-black text-emerald-600">
                {records.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
              </p>
           </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date & Timeline</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Duration</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          {r.employee?.name?.charAt(0) || "?"}
                        </div>
                        <span className="font-black text-slate-800 text-sm tracking-tight">
                          {r.employee?.name || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                           <Calendar size={12} /> {r.date}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-700">
                          <span className="text-emerald-600">{r.checkIn ? formatTime(r.checkIn) : "—"}</span>
                          <ArrowRightLeft size={10} className="text-slate-300" />
                          <span className="text-rose-600">{r.checkOut ? formatTime(r.checkOut) : "Active"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                        <Timer size={14} className="text-slate-400" />
                        {r.workingHours ? `${r.workingHours} hrs` : "Running"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center w-fit gap-1.5 ${
                        r.status === 'PRESENT' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {r.status === 'PRESENT' ? <UserCheck size={12} /> : <UserX size={12} />}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Clock className="text-slate-200" size={48} />
                      <p className="text-slate-400 font-bold">No records found for this selection</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- UTILS --- */
const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};