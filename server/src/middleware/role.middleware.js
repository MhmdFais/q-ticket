const { sendError } = require("../utils/apiResponse");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `'${req.user.role}' is not authorized to access this`,
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
