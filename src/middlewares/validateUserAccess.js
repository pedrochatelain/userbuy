const { verifyToken } = require('../utils/auth.utils');

module.exports = (req, res, next) => {
  try {
    const decodedToken = verifyToken(req);
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
