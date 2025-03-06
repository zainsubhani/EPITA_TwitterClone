const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const { authenticateToken } = require("../MiddleWare/auth");

// Get user by username
router.get("/:username", userController.getUserByUsername);

// Update user profile
router.put("/:id", authenticateToken, userController.updateUser);

// Follow a user
router.post("/:id/follow", authenticateToken, userController.followUser);

// Unfollow a user
router.post("/:id/unfollow", authenticateToken, userController.unfollowUser);

// Get suggested users to follow
router.get(
  "/suggestions/users",
  authenticateToken,
  userController.getSuggestedUsers
);

// Search users
router.get("/search/users", userController.searchUsers);

module.exports = router;
