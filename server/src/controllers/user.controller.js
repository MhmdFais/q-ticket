const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
} = require("../services/user.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getUsers = async (req, res) => {
  try {
    const { page, limit, role, search } = req.query;
    const result = await getAllUsers({ page, limit, role, search });
    return sendSuccess(res, 200, "Users fetched successfully", result);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return sendSuccess(res, 200, "User fetched successfully", user);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await updateUserStatus(req.params.id, isActive, req.user._id);
    return sendSuccess(res, 200, "User status updated successfully", user);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await updateUserRole(req.params.id, role);
    return sendSuccess(res, 200, "User role updated successfully", user);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

module.exports = { getUsers, getUser, toggleUserStatus, changeUserRole };
