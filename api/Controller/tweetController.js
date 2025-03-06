const Tweet = require("../Models/Tweet");
const User = require("../Models/User");

// Create a new tweet
exports.createTweet = async (req, res) => {
  try {
    const { content, media, quoteTweetId, inReplyToTweetId } = req.body;

    if (!content && (!media || media.length === 0)) {
      return res
        .status(400)
        .json({ message: "Tweet must have content or media" });
    }

    const newTweet = new Tweet({
      user: req.user.id,
      content: content || "",
      media: media || [],
    });

    // Handle quote tweet
    if (quoteTweetId) {
      const quoteTweet = await Tweet.findById(quoteTweetId);
      if (!quoteTweet) {
        return res.status(404).json({ message: "Quote tweet not found" });
      }
      newTweet.quoteTweet = quoteTweetId;
    }

    // Handle reply
    if (inReplyToTweetId) {
      const replyToTweet = await Tweet.findById(inReplyToTweetId);
      if (!replyToTweet) {
        return res.status(404).json({ message: "Tweet to reply to not found" });
      }
      newTweet.inReplyToTweet = inReplyToTweetId;
      newTweet.inReplyToUser = replyToTweet.user;
    }

    const savedTweet = await newTweet.save();

    // Populate tweet with user data
    const populatedTweet = await Tweet.findById(savedTweet._id)
      .populate("user", "username profilePicture")
      .populate("quoteTweet")
      .populate({
        path: "quoteTweet",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      })
      .populate("inReplyToUser", "username");

    res.status(201).json(populatedTweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tweet by ID
exports.getTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
      .populate("user", "username profilePicture")
      .populate("quoteTweet")
      .populate({
        path: "quoteTweet",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      })
      .populate("inReplyToUser", "username")
      .populate("comments.user", "username profilePicture");

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(200).json(tweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete tweet
exports.deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if the user is the tweet owner
    if (tweet.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this tweet" });
    }

    await tweet.remove();

    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get home timeline tweets
exports.getHomeTimeline = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get tweets from users that current user follows and own tweets
    const tweets = await Tweet.find({
      $or: [{ user: { $in: currentUser.following } }, { user: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .populate("quoteTweet")
      .populate({
        path: "quoteTweet",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      })
      .populate("inReplyToUser", "username")
      .limit(20);

    res.status(200).json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user tweets
exports.getUserTweets = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tweets = await Tweet.find({
      user: user._id,
      inReplyToTweet: { $exists: false }, // Don't include replies
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .populate("quoteTweet")
      .populate({
        path: "quoteTweet",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      });

    res.status(200).json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user replies
exports.getUserReplies = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const replies = await Tweet.find({
      user: user._id,
      inReplyToTweet: { $exists: true },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .populate("inReplyToTweet")
      .populate("inReplyToUser", "username profilePicture");

    res.status(200).json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tweet replies
exports.getTweetReplies = async (req, res) => {
  try {
    const replies = await Tweet.find({ inReplyToTweet: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture");

    res.status(200).json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/Unlike a tweet
exports.likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if user already liked the tweet
    const isLiked = tweet.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike the tweet
      await Tweet.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user.id },
      });
      res.status(200).json({ message: "Tweet unliked" });
    } else {
      // Like the tweet
      await Tweet.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user.id },
      });
      res.status(200).json({ message: "Tweet liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Retweet/Unretweet a tweet
exports.retweetTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if user already retweeted the tweet
    const isRetweeted = tweet.retweets.includes(req.user.id);

    if (isRetweeted) {
      // Unretweet
      await Tweet.findByIdAndUpdate(req.params.id, {
        $pull: { retweets: req.user.id },
      });
      res.status(200).json({ message: "Tweet unretweeted" });
    } else {
      // Retweet
      await Tweet.findByIdAndUpdate(req.params.id, {
        $push: { retweets: req.user.id },
      });
      res.status(200).json({ message: "Tweet retweeted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment to a tweet
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const comment = {
      user: req.user.id,
      content,
    };

    const updatedTweet = await Tweet.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    ).populate("comments.user", "username profilePicture");

    res
      .status(200)
      .json(updatedTweet.comments[updatedTweet.comments.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search tweets
exports.searchTweets = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const tweets = await Tweet.find({
      content: { $regex: q, $options: "i" },
    })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
