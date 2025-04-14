const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const userIdFromToken = decodedToken.id;
    if (userIdFromToken !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own purchases' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
