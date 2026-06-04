const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { register, login } = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate.middleware");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "agent", "user").default("user"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

//  api/auth/register
router.post("/register", validate(registerSchema), register);

//  api/auth/login
router.post("/login", validate(loginSchema), login);

module.exports = router;
