/**
 * Input validation utilities for the Twitter clone application
 */

/**
 * Validate user registration input
 * @param {Object} data - User registration data
 * @returns {Object} Validation result with errors and isValid flag
 */
const validateRegistration = (data) => {
  const errors = {};

  // Extract fields with default values
  const {
    username = "",
    email = "",
    password = "",
    confirmPassword = "",
  } = data;

  // Email validation using regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Username validation - alphanumeric with underscores, 3-15 chars
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

  // Check username
  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (!usernameRegex.test(username)) {
    errors.username =
      "Username must be 3-15 characters and can only contain letters, numbers, and underscores";
  }

  // Check email
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email address";
  }

  // Check password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Check password confirmation
  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validate login input
 * @param {Object} data - Login data
 * @returns {Object} Validation result with errors and isValid flag
 */
const validateLogin = (data) => {
  const errors = {};

  // Extract fields with default values
  const { username = "", password = "" } = data;

  // Check username/email
  if (!username.trim()) {
    errors.username = "Username or email is required";
  }

  // Check password
  if (!password) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validate tweet input
 * @param {Object} data - Tweet data
 * @returns {Object} Validation result with errors and isValid flag
 */
const validateTweet = (data) => {
  const errors = {};

  // Extract fields with default values
  const { content = "", media = [] } = data;

  // Tweet must have either content or media
  if (!content.trim() && (!media || media.length === 0)) {
    errors.content = "Tweet must have content or media";
  }

  // Check content length (max 280 characters)
  if (content.length > 280) {
    errors.content = "Tweet content cannot exceed 280 characters";
  }

  // Check media (max 4 items)
  if (media && media.length > 4) {
    errors.media = "Tweet cannot have more than 4 media items";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validate profile update input
 * @param {Object} data - Profile update data
 * @returns {Object} Validation result with errors and isValid flag
 */
const validateProfileUpdate = (data) => {
  const errors = {};

  // Extract fields with default values
  const { bio = "", website = "", location = "" } = data;

  // Check bio length (max 160 characters)
  if (bio && bio.length > 160) {
    errors.bio = "Bio cannot exceed 160 characters";
  }

  // Check website URL format
  if (website) {
    // Simple URL validation
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(website)) {
      errors.website = "Please provide a valid URL";
    }
  }

  // Check location length
  if (location && location.length > 30) {
    errors.location = "Location cannot exceed 30 characters";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validate comment input
 * @param {Object} data - Comment data
 * @returns {Object} Validation result with errors and isValid flag
 */
const validateComment = (data) => {
  const errors = {};

  // Extract content with default value
  const { content = "" } = data;

  // Check content
  if (!content.trim()) {
    errors.content = "Comment content is required";
  } else if (content.length > 280) {
    errors.content = "Comment cannot exceed 280 characters";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Create a middleware to validate request data
 * @param {Function} validator - Validation function to use
 * @param {string} source - Request property to validate (body, query, params)
 * @returns {Function} Express middleware
 */
const validationMiddleware = (validator, source = "body") => {
  return (req, res, next) => {
    const { errors, isValid } = validator(req[source]);

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTweet,
  validateProfileUpdate,
  validateComment,
  validationMiddleware,
};
