const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return sendError(res, 400, "Invalid ID format");
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(
      res,
      409,
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return sendError(res, 400, message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, 401, "Invalid token");
  }

  // Token expired
  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, "Token expired, please login again");
  }

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return sendError(res, 403, "Not allowed by CORS");
  }

  // Default
  return sendError(
    res,
    err.statusCode || 500,
    err.message || "Something went wrong",
  );
};

module.exports = { errorHandler };
