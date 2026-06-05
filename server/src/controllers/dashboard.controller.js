const {
  getDashboardStats,
  getAgentStats,
  getUserStats,
} = require("../services/dashboard.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getStats = async (req, res) => {
  try {
    let stats;

    if (req.user.role === "admin") {
      stats = await getDashboardStats();
    } else if (req.user.role === "agent") {
      stats = await getAgentStats(req.user._id);
    } else {
      stats = await getUserStats(req.user._id);
    }

    return sendSuccess(res, 200, "Dashboard stats fetched successfully", stats);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

module.exports = { getStats };
