const productController = require('../product.controller');
const productService = require('../product.service');

// Mock the product service
jest.mock('../product.service.js');

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Product Controller', () => {
  describe('addProduct', () => {
    it('should return 200 and a success message when product is added', async () => {
      const req = mockRequest({ name: 'Test Product', price: 100 });
      const res = mockResponse();

      productService.addProduct.mockResolvedValue();

      await productController.addProduct(req, res);

      expect(productService.addProduct).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product added successfully',
        product: req.body,
      });
    });

    it('should return 500 and an error message on service failure', async () => {
      const req = mockRequest({ name: 'Test Product', price: 100 });
      const res = mockResponse();

      const error = new Error('Service error');
      productService.addProduct.mockRejectedValue(error);

      await productController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
          error: 'Service error',
          details: error,
      });
    });

  });

  describe('getProducts', () => {
    it('should return 200 and a list of products', async () => {
      const mockProducts = [{ name: 'Product1' }, { name: 'Product2' }];
      const req = mockRequest({}, {}, { category: 'electronics' });
      const res = mockResponse();

      productService.getProducts.mockResolvedValue(mockProducts);

      await productController.getProducts(req, res);

      expect(productService.getProducts).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        numberOfProducts: mockProducts.length,
        products: mockProducts,
      });
    });

    it('should return the appropriate error status and message on failure', async () => {
      const req = mockRequest({}, {}, { category: 'electronics' });
      const res = mockResponse();

      const error = new Error('No products found');
      error.statusCode = 404;
      productService.getProducts.mockRejectedValue(error);

      await productController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No products found' });
    });
  });

  describe('deleteProduct', () => {
    it('should return 200 and a success message when product is deleted', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      const mockProduct = { id: '123', name: 'Test Product' };
      productService.deleteProduct.mockResolvedValue(mockProduct);

      await productController.deleteProduct(req, res);

      expect(productService.deleteProduct).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product deleted successfully',
        product: mockProduct,
      });
    });

    it('should return the appropriate error status and message on failure', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      const error = new Error('Product not found');
      error.statusCode = 404;
      productService.deleteProduct.mockRejectedValue(error);

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('updateProduct', () => {
    it('should return 200 and a success message when product is updated', async () => {
      const req = mockRequest({ price: 150 }, { idProduct: '123' });
      const res = mockResponse();

      const updatedProduct = { id: '123', name: 'Test Product', price: 150 };
      productService.updateProduct.mockResolvedValue(updatedProduct);

      await productController.updateProduct(req, res);

      expect(productService.updateProduct).toHaveBeenCalledWith('123', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    });

    it('should return the appropriate error status and message on failure', async () => {
      const req = mockRequest({ price: 150 }, { idProduct: '123' });
      const res = mockResponse();

      const error = new Error('Update failed');
      error.statusCode = 500;
      productService.updateProduct.mockRejectedValue(error);

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });
});
