import { useNavigate } from "react-router-dom";

const TicketCard = ({
  ticket,
  showCreatedBy = false,
  showAssignedTo = false,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket._id}`)}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-gray-400">
          {ticket.ticketNumber}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-md font-medium
          ${
            ticket.status === "Open"
              ? "bg-blue-50 text-blue-600"
              : ticket.status === "In Progress"
                ? "bg-amber-50 text-amber-600"
                : ticket.status === "Resolved"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-500"
          }`}
        >
          {ticket.status}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-3 line-clamp-2">
        {ticket.title}
      </p>
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-0.5 rounded-md font-medium
          ${
            ticket.priority === "Urgent"
              ? "bg-red-50 text-red-600"
              : ticket.priority === "High"
                ? "bg-orange-50 text-orange-600"
                : ticket.priority === "Medium"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {ticket.priority}
        </span>
        {showCreatedBy && (
          <span className="text-xs text-gray-400">
            {ticket.createdBy?.name}
          </span>
        )}
        {showAssignedTo && (
          <span
            className={`text-xs ${ticket.assignedTo ? "text-gray-400" : "text-red-400 font-medium"}`}
          >
            {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}
          </span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
