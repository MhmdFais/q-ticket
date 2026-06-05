const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  addComment,
  deleteTicket,
} = require("../services/ticket.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const create = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = await createTicket({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
    });
    return sendSuccess(res, 201, "Ticket created successfully", ticket);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      priority,
      category,
      search,
      assignedTo,
      createdBy,
    } = req.query;
    const result = await getAllTickets({
      page,
      limit,
      status,
      priority,
      category,
      search,
      assignedTo,
      createdBy,
      role: req.user.role,
      userId: req.user._id,
    });
    return sendSuccess(res, 200, "Tickets fetched successfully", result);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const getOne = async (req, res) => {
  try {
    const ticket = await getTicketById(
      req.params.id,
      req.user.role,
      req.user._id,
    );
    return sendSuccess(res, 200, "Ticket fetched successfully", ticket);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const update = async (req, res) => {
  try {
    const ticket = await updateTicket(
      req.params.id,
      req.body,
      req.user.role,
      req.user._id,
    );
    return sendSuccess(res, 200, "Ticket updated successfully", ticket);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const ticket = await updateTicketStatus(
      req.params.id,
      status,
      note,
      req.user._id,
    );
    return sendSuccess(res, 200, "Ticket status updated successfully", ticket);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const assign = async (req, res) => {
  try {
    const { agentId } = req.body;
    const ticket = await assignTicket(req.params.id, agentId);
    return sendSuccess(res, 200, "Ticket assigned successfully", ticket);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await addComment(
      req.params.id,
      message,
      req.user._id,
      req.user.role,
    );
    return sendSuccess(res, 201, "Comment added successfully", ticket);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const remove = async (req, res) => {
  try {
    await deleteTicket(req.params.id, req.user.role, req.user._id);
    return sendSuccess(res, 200, "Ticket deleted successfully");
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  updateStatus,
  assign,
  comment,
  remove,
};
