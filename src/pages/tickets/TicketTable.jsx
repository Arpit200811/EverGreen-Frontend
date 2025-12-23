import { useState } from "react";
import TicketStatusBadge from "./TicketStatusBadge";
import { UserPlus, Plus, Edit2, Trash2, X, Download } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

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
  

  const [form, setForm] = useState({
    customerName: "",
    deviceType: "",
    deviceModel: "",
    issueDescription: "",
    estimatedCost: "",
    status: "OPEN",
  });

  /* ================= MODAL HANDLERS ================= */
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

  const closeModal = () => {
    setShowModal(false);
    setEditingTicket(null);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      if (editingTicket) {
        await API.put(`/tickets/${editingTicket._id}`, form);
      } else {
        await API.post("/tickets", form);
      }

      closeModal();
      refreshTickets?.(); // 🔥 instant refresh
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await API.delete(`/tickets/${deletingTicket}`);
      setDeletingTicket(null);
      refreshTickets?.(); // 🔥 instant refresh
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-56">
        <ClipLoader color="#059669" size={40} />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl overflow-x-auto">
      {/* HEADER */}
      {user?.role === "ADMIN" && (
        <div className="flex justify-end p-4">
          <button
            onClick={openCreate}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
          >
            <Plus size={16} /> Create Ticket
          </button>
        </div>
      )}

      <table className="w-full min-w-[1100px]">
        <thead className="bg-gray-100 text-xs sm:text-sm text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Id</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Device</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Engineer</th>
            <th className="px-4 py-3">Cost (₹)</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="text-xs sm:text-sm">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((t, index) => {
              const canAssign =
                user?.role === "ADMIN" &&
                t.status === "OPEN" &&
                !t.assignedEngineer;

              return (
                <tr key={t._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {t.customer?.name || "—"}
                  </td>
                  <td className="px-4 py-3">{t.deviceType}</td>
                  <td className="px-4 py-3">{t.deviceModel || "—"}</td>
                  <td className="px-4 py-3">
                    <TicketStatusBadge status={t.status} />
                  </td>
                  <td
                    className="px-4 py-3 max-w-xs truncate"
                    title={t.issueDescription}
                  >
                    {t.issueDescription}
                  </td>
                  <td className="px-4 py-3">
                    {t.assignedEngineer?.name || (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {t.estimatedCost ? `₹ ${t.estimatedCost}` : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {user?.role === "ADMIN" &&
                        t.status === "COMPLETED" &&
                        t.receiptImage && (
                          <a
                            href={t.receiptImage}
                            download={`receipt-${t._id}.png`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            title="Download Receipt"
                          >
                            <Download size={14} />
                          </a>
                        )}
                      {canAssign && (
                        <button
                          onClick={() => onAssignClick(t)}
                          className="p-2 rounded bg-emerald-100 text-emerald-700"
                        >
                          <UserPlus size={14} />
                        </button>
                      )}

                      {user?.role === "ADMIN" && (
                        <>
                          <button
                            onClick={() => openEdit(t)}
                            className="p-2 rounded bg-blue-100 text-blue-700"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingTicket(t._id)}
                            className="p-2 rounded bg-red-100 text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4">
            <div className="bg-emerald-600 p-4 flex justify-between">
              <h3 className="text-white font-semibold">
                {editingTicket ? "Edit Ticket" : "Create Ticket"}
              </h3>
              <button onClick={closeModal}>
                <X className="text-white" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <Input
                label="Customer Name"
                value={form.customerName}
                onChange={(v) => setForm({ ...form, customerName: v })}
              />
              <Input
                label="Device Type"
                value={form.deviceType}
                onChange={(v) => setForm({ ...form, deviceType: v })}
              />
              <Input
                label="Device Model"
                value={form.deviceModel}
                onChange={(v) => setForm({ ...form, deviceModel: v })}
              />
              <Textarea
                label="Issue Description"
                value={form.issueDescription}
                onChange={(v) => setForm({ ...form, issueDescription: v })}
              />
              <Input
                label="Estimated Cost"
                value={form.estimatedCost}
                onChange={(v) => setForm({ ...form, estimatedCost: v })}
              />
            </div>

            <div className="p-4 flex gap-3">
              <button
                onClick={closeModal}
                className="border rounded px-4 py-2 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-600 text-white rounded px-4 py-2 flex-1"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}
      {deletingTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <p className="mb-4 font-medium">Delete this ticket?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingTicket(null)}
                className="border rounded px-4 py-2 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white rounded px-4 py-2 flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== INPUTS ===== */
const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    />
  </div>
);
