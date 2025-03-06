const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const { authenticateToken } = require("../MiddleWare/auth");
const {
  validateRegistration,
  validateLogin,
  validationMiddleware,
} = require("../utils.js/validator");

// Register a new user
router.post(
  "/register",
  validationMiddleware(validateRegistration),
  authController.register
);

// Login user
router.post(
  "/login",
  validationMiddleware(validateLogin),
  authController.login
);

// Get current user
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;
