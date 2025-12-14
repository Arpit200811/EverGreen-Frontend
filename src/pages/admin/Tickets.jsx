import { useEffect, useState } from "react";
import TicketTable from "../tickets/TicketTable";
import AssignEngineerModal from "../tickets/AssignEngineerModal";
import { getTickets } from "../../api/tickets";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getTickets();
      setTickets(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tickets</h1>

      <TicketTable
        tickets={tickets}
        loading={loading}
        onAssignClick={setSelectedTicket}
      />

      {selectedTicket && (
        <AssignEngineerModal
          open={!!selectedTicket}
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSuccess={loadTickets}
        />
      )}
    </div>
  );
}
