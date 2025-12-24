import { useEffect, useState } from "react";
import { 
  Play, CheckCircle, Clock, FileText, X, Monitor, 
  Smartphone, HardDrive, AlertCircle, UploadCloud, ChevronRight, ChevronLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import { socket } from "../../utils/socket";

const PAGE_SIZE = 6;

export default function EmployeeTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [page, setPage] = useState(1);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error("Error loading tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    socket.on("ticketUpdated", loadTickets);
    socket.on("ticketCancelled", loadTickets);
    return () => {
      socket.off("ticketUpdated");
      socket.off("ticketCancelled");
    };
  }, []);

  const startTicket = async (id) => {
    await API.put(`/tickets/${id}/start`);
    loadTickets();
  };

  const completeTicket = async () => {
    await API.put(`/tickets/${selected._id}/complete`, { receiptImage: receipt });
    setSelected(null);
    setReceipt(null);
    loadTickets();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setReceipt(reader.result);
    reader.readAsDataURL(file);
  };

  const paginated = tickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(tickets.length / PAGE_SIZE);

  // Helper: Device Icon
  const getDeviceIcon = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes('phone')) return <Smartphone size={18} />;
    if (t?.includes('laptop') || t?.includes('pc')) return <Monitor size={18} />;
    return <HardDrive size={18} />;
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto bg-[#f8fafc] min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Assignments</h1>
          <p className="text-slate-500 font-medium">Manage and track your assigned technical tickets</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 hidden md:block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Active: </span>
          <span className="text-emerald-600 font-black">{tickets.length}</span>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Device Detail</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Issue Description</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {paginated.map((t) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={t._id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          {getDeviceIcon(t.deviceType)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.deviceType}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.deviceModel || "Standard Model"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 max-w-xs truncate font-medium" title={t.issueDescription}>
                        {t.issueDescription}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`
                        px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider
                        ${t.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600' : ''}
                        ${t.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : ''}
                        ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : ''}
                      `}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {t.status === "ASSIGNED" && (
                        <button
                          onClick={() => startTicket(t._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                          <Play size={14} fill="currentColor" /> Start Work
                        </button>
                      )}
                      {t.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => setSelected(t)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                        >
                          <CheckCircle size={14} /> Mark Done
                        </button>
                      )}
                      {t.status === "COMPLETED" && (
                        <div className="flex items-center justify-end gap-2 text-slate-400 font-bold text-[10px] uppercase">
                          <Clock size={14} /> {new Date(t.endTime).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900">{paginated.length}</span> of {tickets.length} tickets
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page-1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page+1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- COMPLETION MODAL --- */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Final Step</h3>
                  <p className="text-slate-500 text-sm font-medium">Please upload service receipt or photo</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="relative group border-2 border-dashed border-slate-200 rounded-3xl p-8 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
                <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="text-center">
                  {receipt ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
                        <CheckCircle size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Photo Attached!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-400">Tap to upload or drop image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setSelected(null)} className="px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                  Cancel
                </button>
                <button 
                  disabled={!receipt}
                  onClick={completeTicket}
                  className="px-6 py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 shadow-xl shadow-emerald-100 transition-all"
                >
                  Finish Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}