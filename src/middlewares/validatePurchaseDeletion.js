const jwt = require('jsonwebtoken');
const ROLES = require('../config/roles');
const purchaseService = require('../features/purchase/purchase.service')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const userIdFromToken = decodedToken.id
    const userRole = decodedToken.role;
    const purchase = await purchaseService.getPurchase(req.params.idPurchase)
    if ( ! purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
    }
    // Allow if user is accessing their own purchase or is an admin
    if (userIdFromToken === purchase.userID.toString() || userRole === ROLES.ADMIN) {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
