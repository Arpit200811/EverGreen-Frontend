export default function TicketStatusBadge({ status }) {
  const colors = {
    OPEN: "bg-gray-200 text-gray-800",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-2 sm:px-3
        py-0.5 sm:py-1
        rounded-full
        text-[10px] sm:text-xs
        font-semibold
        whitespace-nowrap
        ${colors[status]}
      `}
    >
      {status}
    </span>
  );
}
