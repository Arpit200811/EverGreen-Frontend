import TicketStatusBadge from "./TicketStatusBadge";
import { UserPlus } from "lucide-react";

export default function TicketTable({ tickets, onAssignClick }) {
  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-3">Customer</th>
          <th className="p-3">Device</th>
          <th className="p-3">Status</th>
          <th className="p-3">Engineer</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((t) => (
          <tr key={t._id} className="border-t">
            <td className="p-3">{t.customer?.name}</td>
            <td className="p-3">{t.deviceType}</td>
            <td className="p-3">
              <TicketStatusBadge status={t.status} />
            </td>
            <td className="p-3">
              {t.assignedEngineer?.name || "—"}
            </td>
            <td className="p-3">
              <button
                onClick={() => onAssignClick(t)}
                className="text-emerald-600 flex items-center gap-1"
              >
                <UserPlus size={16} /> Assign
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
