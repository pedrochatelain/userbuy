const { ObjectId } = require('mongodb');

/**
 * Middleware to validate MongoDB ObjectId.
 * Checks if the given ID in the request parameter is valid.
 */
const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  
  if (!ObjectId.isValid(id) || String(new ObjectId(id)) !== id) {
    return res.status(400).json({ error: `Invalid ID for ${paramName}` });
  }

  next();
};

module.exports = validateObjectId;
