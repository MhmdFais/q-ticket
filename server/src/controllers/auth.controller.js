const { registerUser, loginUser } = require("../services/auth.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    return sendSuccess(res, 201, "Registration successful", result);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
};

module.exports = { register, login };
