const { verifyToken } = require('../utils/auth.utils');

module.exports = async (req, res, next) => {
  try {
    const decodedToken = await verifyToken(req.headers.authorization?.split(' ')[1]); // Assuming token is in 'Bearer <token>' format
    const { id: idUserFromToken } = decodedToken;

    if (idUserFromToken !== req.params.idUser) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
    }
    next();
  } catch (error) {
    const errorMessage = error.message === 'Access token is missing'
      ? 'Access token is missing'
      : 'Invalid or expired token';
    return res.status(401).json({ error: errorMessage });
  }
};
