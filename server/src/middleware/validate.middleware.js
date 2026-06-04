const { sendError } = require("../utils/apiResponse");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message.replace(/['"]/g, ""),
      }));

      return sendError(res, 400, "Validation failed", errors);
    }

    next();
  };
};

module.exports = { validate };
