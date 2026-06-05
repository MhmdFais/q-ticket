const express = require("express");
const router = express.Router();

const { getStats } = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// api/dashboard
router.get("/", protect, authorizeRoles("admin", "agent", "user"), getStats);

module.exports = router;
