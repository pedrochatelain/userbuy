const { ObjectId } = require('mongodb');

module.exports = (req, res, next) => {
    const productsID = req.body.productsID;
    const invalidIds = productsID.filter(id => {
        // Check if the ID is a string and a valid ObjectId
        return typeof id !== 'string' || !ObjectId.isValid(id) || String(new ObjectId(id)) !== id;
    });
    if (invalidIds.length > 0) {
        return res.status(400).send({ 
            error: `The following product IDs are not valid: ${invalidIds.join(', ')}`
        });
    }
    next()
}