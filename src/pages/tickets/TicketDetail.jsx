import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    API.get(`/tickets/${id}`).then(res => setTicket(res.data));
  }, [id]);

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Ticket Detail</h1>

      <p><b>Device:</b> {ticket.deviceType}</p>
      <p><b>Issue:</b> {ticket.issueDescription}</p>
      <p><b>Status:</b> {ticket.status}</p>

      <hr className="my-3" />

      <p><b>Customer:</b> {ticket.customer?.name}</p>
      <p><b>Engineer:</b> {ticket.assignedEngineer?.name || '—'}</p>

      {/* 🔥 ADMIN RECEIPT DOWNLOAD */}
      {user?.role === 'ADMIN' &&
        ticket.status === 'COMPLETED' &&
        ticket.receiptImage && (
          <div className="mt-4">
            <a
              href={ticket.receiptImage}
              download={`receipt-${ticket._id}.png`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Receipt
            </a>
          </div>
        )}
    </div>
  );
}
