// import { useEffect, useState } from 'react';
// import API from '../../api/axios';

// export default function EmployeeTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);
//   const [receipt, setReceipt] = useState(null);

//   /* ---------------- LOAD TICKETS ---------------- */
//   const loadTickets = async () => {
//     setLoading(true);
//     const res = await API.get('/tickets/my');
//     setTickets(res.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadTickets();
//   }, []);

//   /* ---------------- START TICKET ---------------- */
//   const startTicket = async (id) => {
//     await API.put(`/tickets/${id}/start`);
//     loadTickets();
//   };

//   /* ---------------- COMPLETE TICKET ---------------- */
//   const completeTicket = async () => {
//     await API.put(`/tickets/${selected._id}/complete`, {
//       receiptImage: receipt
//     });

//     setSelected(null);
//     setReceipt(null);
//     loadTickets();
//   };

//   /* ---------------- FILE HANDLER ---------------- */
//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onloadend = () => {
//       setReceipt(reader.result);
//     };

//     reader.readAsDataURL(file);
//   };

//   if (loading) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="p-4 sm:p-6">
//       <h1 className="text-lg sm:text-xl font-bold mb-4">My Tickets</h1>

//       <div className="grid gap-4">
//         {tickets.map(t => (
//           <div
//             key={t._id}
//             className="border rounded p-4 shadow bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
//           >
//             <div>
//               <p className="font-semibold">{t.deviceType}</p>
//               <p className="text-sm text-gray-600 break-words">
//                 {t.issueDescription}
//               </p>
//               <p className="text-xs mt-1">
//                 Status:
//                 <span className="ml-1 font-semibold text-blue-600">
//                   {t.status}
//                 </span>
//               </p>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex gap-2 w-full sm:w-auto">
//               {t.status === 'ASSIGNED' && (
//                 <button
//                   className="bg-blue-600 text-white px-4 py-1 rounded w-full sm:w-auto"
//                   onClick={() => startTicket(t._id)}
//                 >
//                   Start
//                 </button>
//               )}

//               {t.status === 'IN_PROGRESS' && (
//                 <button
//                   className="bg-green-600 text-white px-4 py-1 rounded w-full sm:w-auto"
//                   onClick={() => setSelected(t)}
//                 >
//                   Complete
//                 </button>
//               )}

//               {t.status === 'COMPLETED' && (
//                 <span className="text-gray-400 text-sm self-center">
//                   Done
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ---------------- COMPLETE MODAL ---------------- */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-3 z-50">
//           <div className="bg-white p-4 sm:p-6 rounded w-full max-w-sm">
//             <h3 className="font-bold mb-4 text-lg">
//               Complete Ticket
//             </h3>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFile}
//               className="mb-4 w-full text-sm"
//             />

//             <div className="flex flex-col sm:flex-row justify-end gap-2">
//               <button
//                 className="border px-4 py-2 rounded w-full sm:w-auto"
//                 onClick={() => setSelected(null)}
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={!receipt}
//                 className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full sm:w-auto"
//                 onClick={completeTicket}
//               >
//                 Complete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  Play,
  CheckCircle,
  Clock,
  FileText,
  X,
} from "lucide-react";
import API from "../../api/axios";
import { socket } from "../../utils/socket";

const PAGE_SIZE = 5;

export default function EmployeeTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const [page, setPage] = useState(1);

  /* ---------------- LOAD TICKETS ---------------- */
  const loadTickets = async () => {
    setLoading(true);
    const res = await API.get("/tickets/my");
    setTickets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  /* ---------------- SOCKET AUTO REFRESH ---------------- */
  useEffect(() => {
    socket.on("ticketUpdated", loadTickets);
    socket.on("ticketCancelled", loadTickets);
    socket.on("ticketLog", loadTickets);

    return () => {
      socket.off("ticketUpdated", loadTickets);
      socket.off("ticketCancelled", loadTickets);
      socket.off("ticketLog", loadTickets);
    };
  }, []);

  /* ---------------- START ---------------- */
  const startTicket = async (id) => {
    await API.put(`/tickets/${id}/start`);
    loadTickets();
  };

  /* ---------------- COMPLETE ---------------- */
  const completeTicket = async () => {
    await API.put(`/tickets/${selected._id}/complete`, {
      receiptImage: receipt,
    });

    setSelected(null);
    setReceipt(null);
    loadTickets();
  };

  /* ---------------- FILE ---------------- */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setReceipt(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- LOAD LOGS ---------------- */
  // const openLogs = async (ticketId) => {
  //   const res = await API.get(`/tickets/${ticketId}/logs`);
  //   setLogs(res.data);
  //   setShowLogs(true);
  // };

  /* ---------------- PAGINATION ---------------- */
  const start = (page - 1) * PAGE_SIZE;
  const paginated = tickets.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(tickets.length / PAGE_SIZE);

  /* ---------------- STATUS BADGE ---------------- */
  const StatusBadge = ({ status }) => {
    const map = {
      ASSIGNED: "bg-blue-100 text-blue-700",
      IN_PROGRESS: "bg-yellow-100 text-yellow-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          map[status] || "bg-gray-100"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-lg sm:text-xl font-bold mb-4">
        My Tickets
      </h1>

      <div className="bg-white rounded-xl overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed">
          <thead className="bg-gray-100 text-xs sm:text-sm text-gray-600">
            <tr>
              <th className="w-12 px-4 py-3">ID</th>
              <th className="w-40 px-4 py-3">Device</th>
              <th className="w-40 px-4 py-3">Model</th>
              <th className="w-64 px-4 py-3">Issue</th>
              <th className="w-36 px-4 py-3">Status</th>
              <th className="w-44 px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="text-xs sm:text-sm">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No tickets found
                </td>
              </tr>
            ) : (
              paginated.map((t, index) => (
                <tr
                  key={t._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {start + index + 1}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {t.deviceType}
                  </td>

                  <td className="px-4 py-3">
                    {t.deviceModel || "—"}
                  </td>

                  <td
                    className="px-4 py-3 truncate"
                    title={t.issueDescription}
                  >
                    {t.issueDescription}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    {t.status === "ASSIGNED" && (
                      <button
                        onClick={() => startTicket(t._id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700"
                      >
                        <Play size={14} /> Start
                      </button>
                    )}

                    {t.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => setSelected(t)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-green-100 text-green-700"
                      >
                        <CheckCircle size={14} /> Complete
                      </button>
                    )}

                    {t.status === "COMPLETED" && (
                      <div className="text-xs text-gray-500">
                        <Clock size={12} className="inline mr-1" />
                        Done on{" "}
                        {new Date(t.endTime).toLocaleString()}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* LOG MODAL */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Ticket Timeline</h3>
              <button onClick={() => setShowLogs(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {logs.map((l) => (
                <div
                  key={l._id}
                  className="border-l-2 border-emerald-500 pl-3"
                >
                  <p className="text-sm">{l.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(l.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <h3 className="font-bold mb-4">
              Complete Ticket
            </h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="mb-4 w-full text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                disabled={!receipt}
                onClick={completeTicket}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
