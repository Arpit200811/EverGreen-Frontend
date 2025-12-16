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

  if (!ticket) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-3xl mx-auto bg-white rounded shadow space-y-2">
      <h1 className="text-lg sm:text-xl font-bold mb-4">
        Ticket Detail
      </h1>

      <p className="text-sm sm:text-base break-words">
        <b>Device:</b> {ticket.deviceType}
      </p>

      <p className="text-sm sm:text-base break-words">
        <b>Issue:</b> {ticket.issueDescription}
      </p>

      <p className="text-sm sm:text-base">
        <b>Status:</b> {ticket.status}
      </p>

      <hr className="my-3" />

      <p className="text-sm sm:text-base break-words">
        <b>Customer:</b> {ticket.customer?.name}
      </p>

      <p className="text-sm sm:text-base break-words">
        <b>Engineer:</b> {ticket.assignedEngineer?.name || '—'}
      </p>

      {/* 🔥 ADMIN RECEIPT DOWNLOAD */}
      {user?.role === 'ADMIN' &&
        ticket.status === 'COMPLETED' &&
        ticket.receiptImage && (
          <div className="mt-4">
            <a
              href={ticket.receiptImage}
              download={`receipt-${ticket._id}.png`}
              className="inline-block w-full sm:w-auto text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Receipt
            </a>
          </div>
        )}
    </div>
  );
}
