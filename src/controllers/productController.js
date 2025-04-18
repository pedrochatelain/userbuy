const service = require('../services/productServices'); // Adjust the path as needed

const addProduct = async (req, res) => {
  try {
    const product = req.body;
    await service.addProduct(product);
    res.status(200).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
    const products = await service.getProducts(req.query)
    res.json(products)
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        // Delete the document with the matching _id
        const result = await service.deleteProduct(productId);

        if (result) {
        res.status(200).send({ message: 'Product deleted successfully', product: result });
        } else {
        res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { addProduct, getProducts, deleteProduct };
