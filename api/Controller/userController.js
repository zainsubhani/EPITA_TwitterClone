const User = require("../Models/User");
const Tweet = require("../Models/Tweet");

// Get user profile by username
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("followers", "username profilePicture")
      .populate("following", "username profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count tweets
    const tweetCount = await Tweet.countDocuments({ user: user._id });

    res.status(200).json({
      ...user.toJSON(),
      tweetCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    // Make sure the user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    // Fields that are allowed to be updated
    const allowedUpdates = ["bio", "profilePicture", "location", "website"];
    const updates = {};

    // Filter only allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Follow a user
exports.followUser = async (req, res) => {
  try {
    // Can't follow yourself
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "You already follow this user" });
    }

    // Add to following
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.id },
    });

    // Add to followers
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.id },
    });

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    // Can't unfollow yourself
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "You don't follow this user" });
    }

    // Remove from following
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id },
    });

    // Remove from followers
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id },
    });

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get suggested users to follow
exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Find users that current user is not following
    const suggestedUsers = await User.find({
      _id: {
        $ne: req.user.id,
        $nin: currentUser.following,
      },
    })
      .select("username profilePicture bio")
      .limit(5);

    res.status(200).json(suggestedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ],
    })
      .select("username profilePicture bio")
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
