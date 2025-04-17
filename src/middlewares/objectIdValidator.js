const { ObjectId } = require('mongodb');

function validateObjectId(req, res, next) {
    const productId = req.params.id;
    if (!ObjectId.isValid(productId)) {
        return res.status(400).send({ error: 'Invalid product ID format' });
    }
    next();
}
  
module.exports = {validateObjectId}