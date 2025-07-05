const service = require('./product.service'); // Adjust the path as needed

const addProduct = async (req, res) => {
  try {
    const product = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file : null
    };
    const response = await service.addProduct(product);
    res.status(200).json({ message: 'Product added successfully', product: response });
  } catch (err) {
    if ( ! err.statusCode)
      err.statusCode = 500
    res.status(err.statusCode).json(err)  }
};

const addImageProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await service.addImageProduct(req.params.idProduct, req.file)
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    if ( ! err.statusCode)
      err.statusCode = 500
    res.status(err.statusCode).json(err)
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await service.getProducts(req.query)
    res.status(200).json({ numberOfProducts: products.length, products })
  } catch (err) {
    if ( ! err.statusCode)
      err.statusCode = 500
    res.status(err.statusCode).json({ error: err.message })
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await service.getProduct(req.params.idProduct)
    res.status(200).json({ message: "Product fetched successfully", product })
  } catch (err) {
    if ( ! err.statusCode)
      err.statusCode = 500
    res.status(err.statusCode).json({ error: err.message })
  }
}

const deleteProduct = async (req, res) => {
    try {
      const product = await service.deleteProduct(req.params.id)
      res.status(200).json({ message: "Product deleted successfully", product })
  } catch (err) {
    if ( ! err.statusCode)
      err.statusCode = 500
    res.status(err.statusCode).json({ error: err.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const idProduct = req.params.idProduct
    const result = await service.updateProduct(idProduct, req.body);
    res.status(200).json({ message: 'Product updated successfully', product: result });
  } catch (err) {
    if ( ! err.statusCode)
      err.statusCode = 500
    res.status(err.statusCode).json({ error: err.message });
  }
}

module.exports = { 
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  addImageProduct,
  getProduct
};
