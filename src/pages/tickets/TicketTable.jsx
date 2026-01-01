import { useState } from "react";
import TicketStatusBadge from "./TicketStatusBadge";
import {
  UserPlus, Plus, Edit3, Trash2, X, Download, Search, Filter,
  Smartphone, User, IndianRupee, AlertCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ticketSchema = yup.object({
  customerName: yup.string()
    .matches(/^[a-zA-Z\s]{3,50}$/, "Name must be 3-50 letters only")
    .required("Required"),
  deviceType: yup.string()
    .required("Category is required"),
  deviceModel: yup.string()
    .matches(/^[a-zA-Z0-9\s\-\.]{2,40}$/, "Invalid model name")
    .required("Model is required"),
  estimatedCost: yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (numbers only)")
    .required("Required"),
  issueDescription: yup.string()
    .min(10, "Describe at least 10 characters")
    .required("Required"),
});

export default function TicketTable({
  tickets = [],
  loading,
  onAssignClick,
  refreshTickets,
}) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [actionTicketId, setActionTicketId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 6;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      customerName: "",
      deviceType: "",
      deviceModel: "",
      estimatedCost: "",
      issueDescription: ""
    }
  });

  const filteredTickets = tickets.filter(
    (t) =>
      t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.deviceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openCreate = () => {
    setEditingTicket(null);
    reset({
      customerName: "",
      deviceType: "",
      deviceModel: "",
      issueDescription: "",
      estimatedCost: "",
    });
    setShowModal(true);
  };

  const openEdit = (ticket) => {
    setEditingTicket(ticket);
    reset({
      customerName: ticket.customer?.name || "",
      deviceType: ticket.deviceType,
      deviceModel: ticket.deviceModel || "",
      issueDescription: ticket.issueDescription,
      estimatedCost: ticket.estimatedCost || "",
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      // Merge status manually as it's not in the form
      const payload = {
        ...data,
        status: editingTicket ? editingTicket.status : "OPEN"
      };
      
      editingTicket
        ? await API.put(`/tickets/${editingTicket._id}`, payload)
        : await API.post("/tickets", payload);
      setShowModal(false);
      refreshTickets?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleActionConfirm = async () => {
    try {
      if (user?.role === "ADMIN") {
        await API.delete(`/tickets/${actionTicketId}`);
      } else {
        await API.put(`/tickets/${actionTicketId}/cancel`, { status: "CANCELLED" });
      }
      setActionTicketId(null);
      refreshTickets?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <ClipLoader color="#10b981" size={40} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center italic">
          Syncing Records...
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* --- ACTION BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer or device..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
          {user?.role === "ADMIN" && (
            <button
              onClick={openCreate}
              className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all font-bold text-sm shadow-lg shadow-slate-200"
            >
              <Plus size={18} /> Create Ticket
            </button>
          )}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">ID</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Client & Device</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Technician</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estimate</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="text-slate-200" size={48} />
                      <p className="text-slate-400 font-medium">No tickets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentTickets.map((t, index) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-center font-bold text-slate-300">
                      #TKT{indexOfFirstTicket + index + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm flex items-center gap-1">
                          <User size={14} className="text-slate-400" /> {t.customer?.name || "Guest User"}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                          <Smartphone size={12} /> {t.deviceType} • {t.deviceModel || "Generic"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <TicketStatusBadge status={t.status} />
                    </td>
                    <td className="px-6 py-5 text-xs">
                      {t.assignedEngineer ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{t.assignedEngineer.name}</span>
                          {user?.role === "CUSTOMER" && (
                            <span className="text-[10px] text-slate-400 font-medium">{t.assignedEngineer.mobile}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">Waiting</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-slate-700 flex items-center gap-0.5 text-sm">
                        <IndianRupee size={12} className="text-slate-400" /> {t.estimatedCost || "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {/* Fixed: Removed opacity-0 and group-hover classes to show icons always */}
                      <div className="flex justify-end gap-2 transition-opacity">
                        {user?.role === "ADMIN" && t.status === "OPEN" && !t.assignedEngineer && (
                          <ActionButton icon={<UserPlus size={14} />} color="bg-emerald-50 text-emerald-600" onClick={() => onAssignClick(t)} tip="Assign" />
                        )}
                        {user?.role === "ADMIN" && t.status === "COMPLETED" && t.receiptImage && (
                          <a href={t.receiptImage} download target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="Receipt">
                            <Download size={14} />
                          </a>
                        )}
                        {user?.role === "ADMIN" && (
                          <>
                            <ActionButton icon={<Edit3 size={14} />} color="bg-blue-50 text-blue-600" onClick={() => openEdit(t)} tip="Edit" />
                            <ActionButton icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-600" onClick={() => setActionTicketId(t._id)} tip="Delete" />
                          </>
                        )}
                        {user?.role === "CUSTOMER" && t.status === "OPEN" && (
                          <ActionButton icon={<X size={14} />} color="bg-rose-50 text-rose-600" onClick={() => setActionTicketId(t._id)} tip="Cancel" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {indexOfFirstTicket + 1} to {Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all shadow-sm border ${
                    currentPage === i + 1
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS (Same as before) --- */}
      <AnimatePresence>
        {showModal && (
          <Modal
            title={editingTicket ? "Edit Ticket Detail" : "New Service Request"}
            onClose={() => setShowModal(false)}
            onSave={handleSubmit(onSubmit)}
            saving={saving}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Client Name" 
                {...register("customerName")} 
                error={errors.customerName} 
                placeholder="e.g. John Doe" 
              />
              <Input 
                label="Device Category" 
                {...register("deviceType")} 
                error={errors.deviceType} 
                placeholder="e.g. Laptop" 
              />
              <Input 
                label="Model Name" 
                {...register("deviceModel")} 
                error={errors.deviceModel} 
                placeholder="e.g. MacBook Pro M1" 
              />
              <Input 
                label="Estimate Cost (₹)" 
                {...register("estimatedCost")} 
                error={errors.estimatedCost} 
                placeholder="500" 
              />
              <div className="md:col-span-2">
                <Textarea 
                  label="Describe the Problem" 
                  {...register("issueDescription")} 
                  error={errors.issueDescription} 
                  placeholder="Provide detail..." 
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Action Confirmation Modal (Delete/Cancel) */}
      {actionTicketId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32} /></div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{user?.role === "ADMIN" ? "Are you sure?" : "Cancel Request?"}</h3>
            <p className="text-slate-500 text-sm mb-8">{user?.role === "ADMIN" ? "All data will be lost." : "Are you sure you want to cancel?"}</p>
            <div className="flex gap-3">
              <button onClick={() => setActionTicketId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Go Back</button>
              <button onClick={handleActionConfirm} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200">
                {user?.role === "ADMIN" ? "Delete" : "Yes, Cancel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS (Same as before) --- */
const ActionButton = ({ icon, color, onClick, tip }) => (
  <button onClick={onClick} title={tip} className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-90 shadow-sm ${color}`}>
    {icon}
  </button>
);

const Modal = ({ title, children, onClose, onSave, saving }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center font-black">
        <h3 className="text-xl text-slate-800 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
      </div>
      <div className="p-8">{children}</div>
      <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
        <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
        <button onClick={onSave} className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 disabled:opacity-50">
          {saving ? "Processing..." : "Confirm & Save"}
        </button>
      </div>
    </motion.div>
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      {...props} 
      className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 font-medium ${error ? '!bg-red-50 !focus:ring-red-200' : ''}`} 
    />
    {error && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{error.message}</p>}
  </div>
);

const Textarea = ({ label, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      rows={4} 
      {...props} 
      className={`w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 font-medium ${error ? '!bg-red-50 !focus:ring-red-200' : ''}`} 
    />
    {error && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{error.message}</p>}
  </div>
);