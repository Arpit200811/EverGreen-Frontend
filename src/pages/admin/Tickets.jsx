import { useEffect, useState } from "react";
import { getTickets, assignEngineer } from "../../api/tickets";
import TicketTable from "../tickets/TicketTable";
import AssignEngineerModal from "../tickets/AssignEngineerModal";
import api from "../../api/axios";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const t = await getTickets();
    const e = await api.get("/employees");
    setTickets(t.data);
    setEngineers(e.data);
  };

  const handleAssign = async (data) => {
    await assignEngineer(selected._id, data.engineerId);
    setSelected(null);
    loadData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tickets</h1>

      <TicketTable tickets={tickets} onAssignClick={setSelected} />

      {selected && (
        <AssignEngineerModal
          ticket={selected}
          engineers={engineers}
          onAssign={handleAssign}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
