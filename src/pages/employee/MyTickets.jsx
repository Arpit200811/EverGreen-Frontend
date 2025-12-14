import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function EmployeeTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [receipt, setReceipt] = useState(null);

  /* ---------------- LOAD TICKETS ---------------- */
  const loadTickets = async () => {
    setLoading(true);
    const res = await API.get('/tickets/my');
    setTickets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  /* ---------------- START TICKET ---------------- */
  const startTicket = async (id) => {
    await API.put(`/tickets/${id}/start`);
    loadTickets();
  };

  /* ---------------- COMPLETE TICKET ---------------- */
  const completeTicket = async () => {
    await API.put(`/tickets/${selected._id}/complete`, {
      receiptImage: receipt
    });

    setSelected(null);
    setReceipt(null);
    loadTickets();
  };

  /* ---------------- FILE HANDLER ---------------- */
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setReceipt(reader.result);
    };

    reader.readAsDataURL(file);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Tickets</h1>

      <div className="grid gap-4">
        {tickets.map(t => (
          <div
            key={t._id}
            className="border rounded p-4 shadow bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{t.deviceType}</p>
              <p className="text-sm text-gray-600">{t.issueDescription}</p>
              <p className="text-xs mt-1">
                Status:
                <span className="ml-1 font-semibold text-blue-600">
                  {t.status}
                </span>
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              {t.status === 'ASSIGNED' && (
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={() => startTicket(t._id)}
                >
                  Start
                </button>
              )}

              {t.status === 'IN_PROGRESS' && (
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => setSelected(t)}
                >
                  Complete
                </button>
              )}

              {t.status === 'COMPLETED' && (
                <span className="text-gray-400 text-sm">Done</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- COMPLETE MODAL ---------------- */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-4">Complete Ticket</h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>

              <button
                disabled={!receipt}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={completeTicket}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
