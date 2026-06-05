const express = require("express");
const router = express.Router();
const Joi = require("joi");

const {
  getUsers,
  getUser,
  toggleUserStatus,
  changeUserRole,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const updateStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("admin", "agent", "user").required(),
});

// these routes are admin only

// api/users
router.get("/", protect, authorizeRoles("admin"), getUsers);

// api/users/:id
router.get("/:id", protect, authorizeRoles("admin"), getUser);

// api/users/:id/status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  validate(updateStatusSchema),
  toggleUserStatus,
);

// api/users/:id/role
router.patch(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  validate(updateRoleSchema),
  changeUserRole,
);

module.exports = router;
