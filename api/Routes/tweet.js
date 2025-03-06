const express = require("express");
const router = express.Router();
const tweetController = require("../Controller/tweetController");
const { authenticateToken } = require("../MiddleWare/auth");

// Create a new tweet
router.post("/", authenticateToken, tweetController.createTweet);

// Get tweet by ID
router.get("/:id", tweetController.getTweetById);

// Delete tweet
router.delete("/:id", authenticateToken, tweetController.deleteTweet);

// Get home timeline
router.get(
  "/timeline/home",
  authenticateToken,
  tweetController.getHomeTimeline
);

// Get user tweets
router.get("/user/:username", tweetController.getUserTweets);

// Get user replies
router.get("/user/:username/replies", tweetController.getUserReplies);

// Get tweet replies
router.get("/:id/replies", tweetController.getTweetReplies);

// Like/Unlike a tweet
router.post("/:id/like", authenticateToken, tweetController.likeTweet);

// Retweet/Unretweet a tweet
router.post("/:id/retweet", authenticateToken, tweetController.retweetTweet);

// Add comment to a tweet
router.post("/:id/comment", authenticateToken, tweetController.addComment);

// Search tweets
router.get("/search/tweets", tweetController.searchTweets);

module.exports = router;
