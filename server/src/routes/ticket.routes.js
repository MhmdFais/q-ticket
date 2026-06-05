const express = require("express");
const router = express.Router();
const Joi = require("joi");

const {
  create,
  getAll,
  getOne,
  update,
  updateStatus,
  assign,
  comment,
  remove,
} = require("../controllers/ticket.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const createTicketSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string()
    .valid(
      "Bug",
      "Feature Request",
      "Technical Issue",
      "Payment Issue",
      "Account Issue",
      "Other",
    )
    .required(),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent").required(),
});

const updateTicketSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  category: Joi.string().valid(
    "Bug",
    "Feature Request",
    "Technical Issue",
    "Payment Issue",
    "Account Issue",
    "Other",
  ),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent"),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Open", "In Progress", "Resolved", "Closed")
    .required(),
  note: Joi.string().optional(),
});

const assignSchema = Joi.object({
  agentId: Joi.string().required(),
});

const commentSchema = Joi.object({
  message: Joi.string().min(1).required(),
});

// api/tickets
router.post(
  "/",
  protect,
  authorizeRoles("admin", "user"),
  validate(createTicketSchema),
  create,
);

// api/tickets
router.get("/", protect, authorizeRoles("admin", "agent", "user"), getAll);

// api/tickets/:id
router.get("/:id", protect, authorizeRoles("admin", "agent", "user"), getOne);

// api/tickets/:id
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "user"),
  validate(updateTicketSchema),
  update,
);

// api/tickets/:id/status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "agent"),
  validate(updateStatusSchema),
  updateStatus,
);

// api/tickets/:id/assign
router.patch(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  validate(assignSchema),
  assign,
);

// api/tickets/:id/comments
router.post(
  "/:id/comments",
  protect,
  authorizeRoles("admin", "agent", "user"),
  validate(commentSchema),
  comment,
);

// api/tickets/:id
router.delete("/:id", protect, authorizeRoles("admin", "user"), remove);

module.exports = router;
