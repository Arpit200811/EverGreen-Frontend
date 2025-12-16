import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getEngineers } from "../../api/employees";
import { assignEngineer } from "../../api/tickets";

export default function AssignEngineerModal({
  open,
  onClose,
  ticket,
  onSuccess,
}) {
  const [engineers, setEngineers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    getEngineers().then((res) => {
      setEngineers(res.data);
    });
  }, [open]);

  const handleAssign = async () => {
    if (!selected) return alert("Select engineer");
    try {
      setLoading(true);
      await assignEngineer(ticket._id, selected);
      onSuccess(); // refresh tickets
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Assign failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 flex items-center justify-center px-3 sm:px-0">
        <Dialog.Panel className="bg-white w-full max-w-sm sm:max-w-md rounded-lg p-4 sm:p-6 shadow-xl">
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-emerald-700 mb-4">
            Assign Engineer
          </Dialog.Title>

          <p className="text-sm text-gray-600 mb-3 break-words">
            Ticket: <b>{ticket?.deviceType}</b>
          </p>

          {/* Dropdown */}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-5 text-sm sm:text-base"
          >
            <option value="">Select Engineer</option>
            {engineers.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleAssign}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading && <ClipLoader size={16} color="#fff" />}
              Assign
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
