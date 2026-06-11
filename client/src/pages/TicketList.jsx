import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  getAllTicketsThunk,
  deleteTicketThunk,
} from "../features/tickets/ticketSlice";
import Layout from "../components/layout/Layout";
import Spinner from "../components/common/Spinner";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";

const CATEGORIES = [
  "Bug",
  "Feature Request",
  "Technical Issue",
  "Payment Issue",
  "Account Issue",
  "Other",
];
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const TicketList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, pagination, loading } = useSelector(
    (state) => state.tickets,
  );
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
    unassigned: "",
    page: 1,
    limit: 10,
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllTicketsThunk(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await dispatch(deleteTicketThunk(deleteId));
    setDeleteLoading(false);
    setDeleteId(null);
    dispatch(getAllTicketsThunk(filters));
  };

  const getPageTitle = () => {
    if (user?.role === "agent") return "Assigned Tickets";
    if (user?.role === "user") return "My Tickets";
    return "All Tickets";
  };

  return (
    <Layout title={getPageTitle()}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {/* {getPageTitle()} */}
            </h2>
            <p className="text-m text-gray-600 mt-0.5">
              {pagination?.total ?? 0} total tickets
            </p>
          </div>
          {(user?.role === "admin" || user?.role === "user") && (
            <Button onClick={() => navigate("/tickets/create")}>
              New Ticket
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div
            className={`grid grid-cols-1 gap-3 ${user?.role === "admin" ? "md:grid-cols-5" : "md:grid-cols-4"}`}
          >
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={handleSearch}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-600"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-600"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-600"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {user?.role === "admin" && (
              <select
                name="unassigned"
                value={filters.unassigned}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-600"
              >
                <option value="">All Tickets</option>
                <option value="true">Unassigned Only</option>
              </select>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Ticket
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Priority
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Assigned To
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Created
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-gray-400 text-sm"
                    >
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      onClick={() => navigate(`/tickets/${ticket._id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 text-xs font-mono text-gray-400">
                        {ticket.ticketNumber}
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-medium max-w-50 truncate">
                        {ticket.title}
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {ticket.category}
                      </td>
                      <td className="px-5 py-3">
                        <Badge label={ticket.priority} />
                      </td>
                      <td className="px-5 py-3">
                        <Badge label={ticket.status} />
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {ticket.assignedTo?.name || "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div
                          className="flex items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(`/tickets/${ticket._id}`)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {(user?.role === "admin" ||
                            ticket.createdBy?._id === user?._id) && (
                            <button
                              onClick={() =>
                                navigate(`/tickets/${ticket._id}/edit`)
                              }
                              className="text-gray-400 hover:text-amber-500 transition-colors"
                              title="Edit"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          )}
                          {(user?.role === "admin" ||
                            ticket.createdBy?._id === user?._id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(ticket._id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 text-xs border rounded-lg cursor-pointer ${
                        page === pagination.page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default TicketList;
