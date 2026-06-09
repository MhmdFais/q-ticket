const Ticket = require("../models/ticket.model");

const createTicket = async ({
  title,
  description,
  category,
  priority,
  createdBy,
  assignedTo,
}) => {
  const ticket = await Ticket.create({
    title,
    description,
    category,
    priority,
    createdBy,
    assignedTo: assignedTo || null,
    statusHistory: [
      {
        status: "Open",
        changedBy: createdBy,
        note: "Ticket created",
      },
    ],
  });

  return ticket;
};

const getAllTickets = async ({
  page = 1,
  limit = 10,
  status,
  priority,
  category,
  search,
  assignedTo,
  createdBy,
  role,
  userId,
  unassigned,
}) => {
  const query = {};

  // role based filtering
  if (role === "user") query.createdBy = userId;
  if (role === "agent") query.assignedTo = userId;

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (assignedTo) query.assignedTo = assignedTo;
  if (createdBy) query.createdBy = createdBy;
  if (unassigned === "true") query.assignedTo = null;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { ticketNumber: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Ticket.countDocuments(query),
  ]);

  return {
    tickets,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTicketById = async (id, role, userId) => {
  const ticket = await Ticket.findById(id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("comments.createdBy", "name email role")
    .populate("statusHistory.changedBy", "name email role");

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  // users can only view their own tickets
  if (
    role === "user" &&
    ticket.createdBy._id.toString() !== userId.toString()
  ) {
    const error = new Error("Not authorized to view this ticket");
    error.statusCode = 403;
    throw error;
  }

  // agents can only view assigned tickets
  if (
    role === "agent" &&
    ticket.assignedTo?._id.toString() !== userId.toString()
  ) {
    const error = new Error("Not authorized to view this ticket");
    error.statusCode = 403;
    throw error;
  }

  return ticket;
};

const updateTicket = async (id, updates, role, userId) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  // only admin can update all fields
  // user can only update their own tickets that are still open
  if (role === "user") {
    if (ticket.createdBy.toString() !== userId.toString()) {
      const error = new Error("Not authorized to update this ticket");
      error.statusCode = 403;
      throw error;
    }
    if (ticket.status !== "Open") {
      const error = new Error("Cannot update ticket that is no longer open");
      error.statusCode = 400;
      throw error;
    }
  }

  const allowedUpdates = [
    "title",
    "description",
    "category",
    "priority",
    "assignedTo",
  ];
  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) ticket[field] = updates[field];
  });

  await ticket.save();
  return ticket;
};

const updateTicketStatus = async (id, status, note, userId) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  ticket.status = status;
  ticket.statusHistory.push({
    status,
    changedBy: userId,
    note: note || `Status changed to ${status}`,
  });

  await ticket.save();

  const updatedTicket = await Ticket.findById(id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("comments.createdBy", "name email role")
    .populate("statusHistory.changedBy", "name email role");

  return updatedTicket;
};

const assignTicket = async (id, agentId) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  ticket.assignedTo = agentId;
  if (ticket.status === "Open") {
    ticket.status = "In Progress";
    ticket.statusHistory.push({
      status: "In Progress",
      changedBy: agentId,
      note: "Ticket assigned to agent",
    });
  }

  await ticket.save();

  const updatedTicket = await Ticket.findById(id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("comments.createdBy", "name email role")
    .populate("statusHistory.changedBy", "name email role");

  return updatedTicket;
};

const addComment = async (id, message, userId, role) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  // users can only comment on their own tickets
  if (role === "user" && ticket.createdBy.toString() !== userId.toString()) {
    const error = new Error("Not authorized to comment on this ticket");
    error.statusCode = 403;
    throw error;
  }

  ticket.comments.push({ message, createdBy: userId });
  await ticket.save();

  const updatedTicket = await Ticket.findById(id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("comments.createdBy", "name email role")
    .populate("statusHistory.changedBy", "name email role");

  return updatedTicket;
};

const deleteTicket = async (id, role, userId) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  if (role === "user" && ticket.createdBy.toString() !== userId.toString()) {
    const error = new Error("Not authorized to delete this ticket");
    error.statusCode = 403;
    throw error;
  }

  await ticket.deleteOne();
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  addComment,
  deleteTicket,
};
