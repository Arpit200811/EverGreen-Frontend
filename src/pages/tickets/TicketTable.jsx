import { useState } from "react";
import TicketStatusBadge from "./TicketStatusBadge";
import {
  UserPlus,
  Plus,
  Edit3,
  Trash2,
  X,
  Download,
  Search,
  Filter,
  Smartphone,
  User,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { BASE_URL } from "../../api/axios";

export default function TicketTable({
  tickets = [],
  loading,
  onAssignClick,
  refreshTickets,
}) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    deviceType: "",
    deviceModel: "",
    issueDescription: "",
    estimatedCost: "",
    status: "OPEN",
  });

  const filteredTickets = tickets.filter(
    (t) =>
      t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.deviceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingTicket(null);
    setForm({
      customerName: "",
      deviceType: "",
      deviceModel: "",
      issueDescription: "",
      estimatedCost: "",
      status: "OPEN",
    });
    setShowModal(true);
  };

  const openEdit = (ticket) => {
    setEditingTicket(ticket);
    setForm({
      customerName: ticket.customer?.name || "",
      deviceType: ticket.deviceType,
      deviceModel: ticket.deviceModel || "",
      issueDescription: ticket.issueDescription,
      estimatedCost: ticket.estimatedCost || "",
      status: ticket.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      editingTicket
        ? await API.put(`/tickets/${editingTicket._id}`, form)
        : await API.post("/tickets", form);
      setShowModal(false);
      refreshTickets?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/tickets/${deletingTicket}`);
      setDeletingTicket(null);
      refreshTickets?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <ClipLoader color="#10b981" size={40} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
          Syncing Records...
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* --- ACTION BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by customer or device..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                  ID
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Client & Device
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Technician
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Estimate
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="text-slate-200" size={48} />
                      <p className="text-slate-400 font-medium">
                        No tickets found matching your criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t, index) => (
                  <tr
                    key={t._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5 text-center font-bold text-slate-300">
                      #TKT{index + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm flex items-center gap-1">
                          <User size={14} className="text-slate-400" />{" "}
                          {t.customer?.name || "Guest User"}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                          <Smartphone size={12} /> {t.deviceType} •{" "}
                          {t.deviceModel || "Generic"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <TicketStatusBadge status={t.status} />
                    </td>
                    <td className="px-6 py-5">
                      {t.assignedEngineer ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">
                            {t.assignedEngineer.name}
                          </span>
                          {user?.role === "CUSTOMER" && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {t.assignedEngineer.mobile}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">
                          Waiting for Assign
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-slate-700 flex items-center gap-0.5">
                        <IndianRupee size={12} className="text-slate-400" />
                        {t.estimatedCost || "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user?.role === "ADMIN" &&
                          t.status === "OPEN" &&
                          !t.assignedEngineer && (
                            <ActionButton
                              icon={<UserPlus size={14} />}
                              color="bg-emerald-50 text-emerald-600"
                              onClick={() => onAssignClick(t)}
                              tip="Assign Now"
                            />
                          )}
                        {user?.role === "ADMIN" &&
                          t.status === "COMPLETED" &&
                          t.receiptImage && (
                            <a
                              href={t.receiptImage} // Agar URL relative hai toh BASE_URL zaroori hai
                              download={`receipt-${t._id}.png`} // File name specify karein
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              title="Download Receipt"
                            >
                              <Download size={14} />
                            </a>
                          )}
                        {user?.role === "ADMIN" && (
                          <>
                            <ActionButton
                              icon={<Edit3 size={14} />}
                              color="bg-blue-50 text-blue-600"
                              onClick={() => openEdit(t)}
                              tip="Edit"
                            />
                            <ActionButton
                              icon={<Trash2 size={14} />}
                              color="bg-rose-50 text-rose-600"
                              onClick={() => setDeletingTicket(t._id)}
                              tip="Delete"
                            />
                          </>
                        )}
                        {user?.role === "CUSTOMER" && t.status === "OPEN" && (
                          <ActionButton
                            icon={<X size={14} />}
                            color="bg-rose-50 text-rose-600"
                            onClick={() => setDeletingTicket(t._id)}
                            tip="Cancel"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showModal && (
          <Modal
            title={editingTicket ? "Edit Ticket Detail" : "New Service Request"}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            saving={saving}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                value={form.customerName}
                onChange={(v) => setForm({ ...form, customerName: v })}
                placeholder="e.g. John Doe"
              />
              <Input
                label="Device Category"
                value={form.deviceType}
                onChange={(v) => setForm({ ...form, deviceType: v })}
                placeholder="e.g. Laptop"
              />
              <Input
                label="Model Name"
                value={form.deviceModel}
                onChange={(v) => setForm({ ...form, deviceModel: v })}
                placeholder="e.g. MacBook Pro M1"
              />
              <Input
                label="Estimate Cost (₹)"
                value={form.estimatedCost}
                onChange={(v) => setForm({ ...form, estimatedCost: v })}
                placeholder="500"
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Describe the Problem"
                  value={form.issueDescription}
                  onChange={(v) => setForm({ ...form, issueDescription: v })}
                  placeholder="Provide as much detail as possible..."
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      {deletingTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center"
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-slate-500 text-sm mb-8">
              This action cannot be undone. All data related to this ticket will
              be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingTicket(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl transition-all hover:bg-slate-200"
              >
                Keep It
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl transition-all hover:bg-rose-700 shadow-lg shadow-rose-200"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

const ActionButton = ({ icon, color, onClick, tip }) => (
  <button
    onClick={onClick}
    title={tip}
    className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-90 shadow-sm ${color}`}
  >
    {icon}
  </button>
);

const Modal = ({ title, children, onClose, onSave, saving }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
    >
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-8">{children}</div>
      <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Discard
        </button>
        <button
          onClick={onSave}
          className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? "Processing..." : "Confirm & Save"}
        </button>
      </div>
    </motion.div>
  </div>
);

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
    />
  </div>
);
