const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

const getDashboardStats = async () => {
  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    totalUsers,
    totalAgents,
    urgentTickets,
    recentTickets,
    unassignedTickets,
  ] = await Promise.all([
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: "Open" }),
    Ticket.countDocuments({ status: "In Progress" }),
    Ticket.countDocuments({ status: "Resolved" }),
    Ticket.countDocuments({ status: "Closed" }),
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "agent" }),
    Ticket.countDocuments({
      priority: "Urgent",
      status: { $nin: ["Resolved", "Closed"] },
    }),
    Ticket.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5),
    Ticket.countDocuments({ assignedTo: null, status: "Open" }),
  ]);

  return {
    tickets: {
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      closed: closedTickets,
      urgent: urgentTickets,
      unassigned: unassignedTickets,
    },
    users: {
      total: totalUsers,
      agents: totalAgents,
    },
    recentTickets,
  };
};

const getAgentStats = async (agentId) => {
  const [
    totalAssigned,
    openAssigned,
    inProgressAssigned,
    resolvedAssigned,
    closedAssigned,
  ] = await Promise.all([
    Ticket.countDocuments({ assignedTo: agentId }),
    Ticket.countDocuments({ assignedTo: agentId, status: "Open" }),
    Ticket.countDocuments({ assignedTo: agentId, status: "In Progress" }),
    Ticket.countDocuments({ assignedTo: agentId, status: "Resolved" }),
    Ticket.countDocuments({ assignedTo: agentId, status: "Closed" }),
  ]);

  const recentTickets = await Ticket.find({ assignedTo: agentId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    tickets: {
      total: totalAssigned,
      open: openAssigned,
      inProgress: inProgressAssigned,
      resolved: resolvedAssigned,
      closed: closedAssigned,
    },
    recentTickets,
  };
};

const getUserStats = async (userId) => {
  const [total, open, inProgress, resolved, closed] = await Promise.all([
    Ticket.countDocuments({ createdBy: userId }),
    Ticket.countDocuments({ createdBy: userId, status: "Open" }),
    Ticket.countDocuments({ createdBy: userId, status: "In Progress" }),
    Ticket.countDocuments({ createdBy: userId, status: "Resolved" }),
    Ticket.countDocuments({ createdBy: userId, status: "Closed" }),
  ]);

  const recentTickets = await Ticket.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    tickets: {
      total,
      open,
      inProgress,
      resolved,
      closed,
    },
    recentTickets,
  };
};

module.exports = { getDashboardStats, getAgentStats, getUserStats };
