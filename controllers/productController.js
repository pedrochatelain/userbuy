const { validationResult } = require('express-validator');
const service = require('../services/productServices'); // Adjust the path as needed

const addProduct = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = req.body;
  console.log('Received product:', product);

  try {
    service.addProduct(product);
    res.status(200).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProducts = async (req, res) => {
    const products = await service.getProducts()
    res.json(products)
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        // Delete the document with the matching _id
        const result = await service.deleteProduct(productId);

        if (result.deletedCount === 1) {
        res.status(200).send({ message: 'Product deleted successfully' });
        } else {
        res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { addProduct, getProducts, deleteProduct };
