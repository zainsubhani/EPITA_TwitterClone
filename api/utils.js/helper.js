/**
 * Helper utility functions for the Twitter clone application
 */

/**
 * Generate a JWT token
 * @param {Object} user - User object with id and username
 * @param {string} secret - JWT secret key
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (user, secret, expiresIn = "1d") => {
  const jwt = require("jsonwebtoken");

  return jwt.sign(
    {
      id: user._id || user.id,
      username: user.username,
    },
    secret,
    { expiresIn }
  );
};

/**
 * Format tweet content: extract hashtags, mentions, URLs
 * @param {string} content - Tweet content
 * @returns {Object} Formatted content with extracted entities
 */
const formatTweetContent = (content) => {
  if (!content) return { text: "", hashtags: [], mentions: [], urls: [] };

  // Regular expressions for Twitter entities
  const hashtagRegex = /#(\w+)/g;
  const mentionRegex = /@(\w+)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Extract entities
  const hashtags = [];
  const mentions = [];
  const urls = [];

  // Extract hashtags
  let hashtagMatch;
  while ((hashtagMatch = hashtagRegex.exec(content)) !== null) {
    hashtags.push(hashtagMatch[1].toLowerCase());
  }

  // Extract mentions
  let mentionMatch;
  while ((mentionMatch = mentionRegex.exec(content)) !== null) {
    mentions.push(mentionMatch[1].toLowerCase());
  }

  // Extract URLs
  let urlMatch;
  while ((urlMatch = urlRegex.exec(content)) !== null) {
    urls.push(urlMatch[1]);
  }

  return {
    text: content,
    hashtags,
    mentions,
    urls,
  };
};

/**
 * Format user data for API responses (remove sensitive info)
 * @param {Object} user - MongoDB user document
 * @returns {Object} Sanitized user object
 */
const formatUserData = (user) => {
  if (!user) return null;

  // Convert to regular object if it's a Mongoose document
  const userData = user.toObject ? user.toObject() : { ...user };

  // Remove sensitive fields
  delete userData.password;
  delete userData.__v;

  return userData;
};

/**
 * Paginate results
 * @param {Array} data - Array of items to paginate
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @returns {Object} Paginated results with metadata
 */
const paginateResults = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    data: data.slice(startIndex, endIndex),
    pagination: {
      total: data.length,
      page,
      limit,
      pages: Math.ceil(data.length / limit),
    },
  };

  // Add next page info if available
  if (endIndex < data.length) {
    results.pagination.next = {
      page: page + 1,
      limit,
    };
  }

  // Add previous page info if available
  if (startIndex > 0) {
    results.pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return results;
};

/**
 * Calculate read time for content
 * @param {string} content - Text content
 * @returns {number} Read time in minutes
 */
const calculateReadTime = (content) => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Minimum 1 minute
};

/**
 * Generate unique slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .concat("-", Date.now().toString().slice(-4));
};

module.exports = {
  generateToken,
  formatTweetContent,
  formatUserData,
  paginateResults,
  calculateReadTime,
  generateSlug,
};
