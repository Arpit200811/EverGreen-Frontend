import React, { useEffect, useState } from "react";
import { 
  Calendar, Send, CheckCircle, XCircle, Clock, 
  Filter, Search, Plus, User as UserIcon, FileText 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; 
import { BASE_URL } from "../../api/axios";

export default function LeaveManagement() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post("/leaves/apply", form);
      setShowApplyModal(false);
      setForm({ fromDate: "", toDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      alert("Failed to apply leave");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leaves/${id}/status`, { status });
      fetchLeaves(); // List refresh karein
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading Leaves...</div>;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Leave Requests</h1>
          <p className="text-slate-500 text-sm font-medium">
            {user?.role === 'ADMIN' ? 'Manage employee applications' : 'Track your leave status'}
          </p>
        </div>
        {user?.role !== 'ADMIN' && (
          <button 
            onClick={() => setShowApplyModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            <Plus size={20} /> Apply Leave
          </button>
        )}
      </div>

      {/* --- LEAVE TABLE/LIST --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {user?.role === 'ADMIN' && <th className="px-8 py-5">Employee</th>}
                <th className="px-8 py-5">Duration</th>
                <th className="px-8 py-5">Reason</th>
                <th className="px-8 py-5">Status</th>
                {user?.role === 'ADMIN' && <th className="px-8 py-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors">
                  {user?.role === 'ADMIN' && (
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                          {leave.employee?.profileImage ? (
                                          <img 
                                            src={`${BASE_URL}${leave.employee.profileImage}`} 
                                            className="w-full h-full object-cover" 
                                            alt={leave.employee?.name} 
                                          />
                                        ) : (
                                          <span className="font-black text-emerald-600 text-sm uppercase">
                                            {leave.employee?.name?.charAt(0) || "E"}
                                          </span>
                                        )}
                        </div>
                        <span className="font-bold text-slate-700">{leave.employee?.name}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700">
                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Total: {Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1} Days
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 max-w-xs">
                    <p className="text-sm text-slate-600 font-medium truncate italic">"{leave.reason}"</p>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={leave.status} />
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="px-8 py-5 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(leave._id, 'APPROVED')}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => updateStatus(leave._id, 'REJECTED')}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase">Settled</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- APPLY MODAL --- */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <form onSubmit={handleApply}>
                <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
                  <h3 className="text-xl font-black">Request Leave</h3>
                  <button type="button" onClick={() => setShowApplyModal(false)}><XCircle /></button>
                </div>
                
                <div className="p-8 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                      label="From Date" 
                      type="date" 
                      required 
                      value={form.fromDate}
                      onChange={(e) => setForm({...form, fromDate: e.target.value})}
                    />
                    <FormInput 
                      label="To Date" 
                      type="date" 
                      required 
                      value={form.toDate}
                      onChange={(e) => setForm({...form, toDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                    <textarea 
                      rows={4}
                      required
                      value={form.reason}
                      onChange={(e) => setForm({...form, reason: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 font-medium"
                      placeholder="Why do you need leave?"
                    />
                  </div>
                </div>

                <div className="p-8 pt-0 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-600",
    APPROVED: "bg-emerald-50 text-emerald-600",
    REJECTED: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      {...props}
      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
    />
  </div>
);