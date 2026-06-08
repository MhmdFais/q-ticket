import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  updateTicketStatusThunk,
  assignTicketThunk,
  addCommentThunk,
  deleteTicketThunk,
} from "../../features/tickets/ticketSlice";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ConfirmModal from "../common/ConfirmModal";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

const InfoRow = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    <div className="text-sm text-gray-700 font-medium">{children}</div>
  </div>
);

const TicketDetailsContent = ({ ticket: initialTicket, users }) => {
  const { currentTicket } = useSelector((state) => state.tickets);
  const ticket = currentTicket || initialTicket;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const [selectedAgent, setSelectedAgent] = useState(
    ticket.assignedTo?._id || "",
  );
  const [statusLoading, setStatusLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const canEdit = user?.role === "admin" || ticket.createdBy?._id === user?._id;
  const canUpdateStatus = user?.role === "admin" || user?.role === "agent";
  const canAssign = user?.role === "admin";

  const handleStatusUpdate = async () => {
    if (selectedStatus === ticket.status) return;
    setStatusLoading(true);
    await dispatch(
      updateTicketStatusThunk({
        id: ticket._id,
        data: {
          status: selectedStatus,
          note: `Status changed to ${selectedStatus}`,
        },
      }),
    );
    setStatusLoading(false);
  };

  const handleAssign = async () => {
    if (!selectedAgent) return;
    setAssignLoading(true);
    await dispatch(
      assignTicketThunk({ id: ticket._id, data: { agentId: selectedAgent } }),
    );
    setAssignLoading(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    await dispatch(
      addCommentThunk({ id: ticket._id, data: { message: comment } }),
    );
    setComment("");
    setCommentLoading(false);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await dispatch(deleteTicketThunk(ticket._id));
    setDeleteLoading(false);
    navigate("/tickets");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              {ticket.ticketNumber}
            </span>
            <Badge label={ticket.status} />
            <Badge label={ticket.priority} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {ticket.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Created by {ticket.createdBy?.name} ·{" "}
            {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
            >
              <span className="flex items-center gap-1.5">
                <PencilSquareIcon className="w-4 h-4" />
                Edit
              </span>
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <span className="flex items-center gap-1.5">
                <TrashIcon className="w-4 h-4" />
                Delete
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Body - 4 col grid, col1=2, col2=1, col3=1 */}
      <div className="grid grid-cols-4 gap-6 w-full items-start">
        {/* Column 1 - span 2 */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">
              Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
              Comments ({ticket.comments?.length || 0})
            </h3>
            <div className="flex flex-col gap-4 mb-6">
              {ticket.comments?.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  No comments yet
                </p>
              ) : (
                ticket.comments?.map((c) => (
                  <div key={c._id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold shrink-0">
                      {c.createdBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {c.createdBy?.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {c.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form
              onSubmit={handleComment}
              className="flex flex-col gap-3 border-t border-gray-100 pt-4"
            >
              <textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={commentLoading}
                  disabled={!comment.trim()}
                >
                  Add Comment
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Column 2 - Ticket Info - span 1 */}
        <div className="col-span-1 self-start">
          <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
              Ticket Info
            </h3>
            <div className="flex flex-col gap-4">
              <InfoRow label="Category">{ticket.category}</InfoRow>
              <div className="border-t border-gray-100" />
              <InfoRow label="Priority">
                <Badge label={ticket.priority} />
              </InfoRow>
              <div className="border-t border-gray-100" />
              <InfoRow label="Created By">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold">
                    {ticket.createdBy?.name?.charAt(0).toUpperCase()}
                  </div>
                  {ticket.createdBy?.name}
                </div>
              </InfoRow>
              <div className="border-t border-gray-100" />
              <InfoRow label="Created At">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </InfoRow>
              <div className="border-t border-gray-100" />
              <InfoRow label="Last Updated">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </InfoRow>
            </div>
          </div>
        </div>

        {/* Column 3 - Status and Assignment - span 1 */}
        <div className="col-span-1 flex flex-col gap-4 self-start">
          {/* Status */}
          {canUpdateStatus && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
                Status
              </h3>
              <div className="flex flex-col gap-3">
                <InfoRow label="Current Status">
                  <Badge label={ticket.status} />
                </InfoRow>
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-700"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleStatusUpdate}
                    loading={statusLoading}
                    disabled={selectedStatus === ticket.status}
                    className="w-full"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Assignment */}
          {canAssign && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
                Assignment
              </h3>
              <div className="flex flex-col gap-3">
                <InfoRow label="Currently Assigned To">
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                        {ticket.assignedTo.name?.charAt(0).toUpperCase()}
                      </div>
                      {ticket.assignedTo.name}
                    </div>
                  ) : (
                    <span className="text-gray-400 font-normal">
                      Unassigned
                    </span>
                  )}
                </InfoRow>
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-700"
                  >
                    <option value="">Select an agent</option>
                    {users.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAssign}
                    loading={assignLoading}
                    disabled={!selectedAgent}
                    className="w-full"
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
              Status History
            </h3>
            <div className="flex flex-col gap-4">
              {ticket.statusHistory?.map((h) => (
                <div key={h._id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={h.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(h.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {h.note && (
                      <p className="text-xs text-gray-500">{h.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </>
  );
};

export default TicketDetailsContent;
