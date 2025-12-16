import TicketStatusBadge from "./TicketStatusBadge";
import { UserPlus } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";

export default function TicketTable({ tickets = [], loading, onAssignClick }) {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64">
        <ClipLoader color="#059669" size={40} />
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="text-center py-8 sm:py-10 text-gray-500 text-sm sm:text-base">
        No tickets found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full min-w-[900px] border-collapse">
        <thead className="bg-gray-100 text-left text-xs sm:text-sm">
          <tr>
            <th className="p-2 sm:p-3">Id</th>
            <th className="p-2 sm:p-3">Customer</th>
            <th className="p-2 sm:p-3">Device</th>
            <th className="p-2 sm:p-3">Status</th>
            <th className="p-2 sm:p-3">Issue</th>
            <th className="p-2 sm:p-3">Engineer</th>
            <th className="p-2 sm:p-3">Cost (₹)</th>
            <th className="p-2 sm:p-3">Action</th>
          </tr>
        </thead>

        <tbody className="text-xs sm:text-sm">
          {tickets.map((t, index) => {
            const canAssign =
              user?.role === "ADMIN" && !t.assignedEngineer;

            return (
              <tr
                key={t._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-2 sm:p-3 whitespace-nowrap">
                  {index + 1}.
                </td>

                <td className="p-2 sm:p-3 font-medium whitespace-nowrap">
                  {t.customer?.name || "—"}
                </td>

                <td className="p-2 sm:p-3 whitespace-nowrap">
                  {t.deviceType}
                </td>

                <td className="p-2 sm:p-3 whitespace-nowrap">
                  <TicketStatusBadge status={t.status} />
                </td>

                <td
                  className="p-2 sm:p-3 max-w-[180px] sm:max-w-xs truncate"
                  title={t.issueDescription}
                >
                  {t.issueDescription || "—"}
                </td>

                <td className="p-2 sm:p-3 whitespace-nowrap">
                  {t.assignedEngineer?.name || (
                    <span className="text-gray-400">
                      Not Assigned
                    </span>
                  )}
                </td>

                <td className="p-2 sm:p-3 whitespace-nowrap">
                  {t.estimatedCost ? (
                    `₹ ${t.estimatedCost}`
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="p-2 sm:p-3 space-y-1 whitespace-nowrap">
                  {/* ADMIN → ASSIGN */}
                  {canAssign && (
                    <button
                      onClick={() => onAssignClick(t)}
                      className="text-emerald-600 flex items-center gap-1 hover:underline text-xs sm:text-sm"
                    >
                      <UserPlus size={14} />
                      Assign
                    </button>
                  )}

                  {/* ADMIN → DOWNLOAD RECEIPT */}
                  {user?.role === "ADMIN" &&
                    t.status === "COMPLETED" &&
                    t.receiptImage && (
                      <a
                        href={t.receiptImage}
                        download={`receipt-${t._id}.png`}
                        className="text-blue-600 text-[10px] sm:text-xs underline block"
                      >
                        Download Receipt
                      </a>
                    )}

                  {/* fallback */}
                  {!canAssign &&
                    !(
                      user?.role === "ADMIN" &&
                      t.status === "COMPLETED" &&
                      t.receiptImage
                    ) && (
                      <span className="text-gray-400 text-[10px] sm:text-xs">
                        —
                      </span>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
