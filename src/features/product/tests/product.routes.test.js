const request = require('supertest');
const express = require('express');
const router = require('../product.routes');
const productController = require('../product.controller');
const validateProductCreation = require('../../../middlewares/validateProductCreation');
const authorizeAdmin = require('../../../middlewares/authorizeAdmin');
const validateQueryParamsProduct = require('../../../middlewares/validateQueryParamsProduct');

// Mock the middlewares and controller
jest.mock('../../../middlewares/validateProductCreation', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/authorizeAdmin', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/validateQueryParamsProduct', () => jest.fn((req, res, next) => next()));
jest.mock('../product.controller', () => ({
  addProduct: jest.fn(),
  updateProduct: jest.fn(),
  getProducts: jest.fn(),
  deleteProduct: jest.fn(),
}));

// Create an instance of the Express app and use the router
const app = express();
app.use(express.json());
app.use(router);

describe('Product Routes', () => {
  describe('POST /api/products', () => {
    it('should call addProduct controller with the correct data', async () => {
      const mockRequestBody = { name: 'Test Product', price: 100 };
      const mockResponse = { message: 'Product added successfully', product: mockRequestBody };

      productController.addProduct.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/products')
        .send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(productController.addProduct).toHaveBeenCalled();
      expect(validateProductCreation).toHaveBeenCalled();
    });

    it('should define the POST /api/products route', () => {
      const routes = router.stack.map((layer) => ({
        path: layer.route?.path,
        method: layer.route?.stack[0]?.method,
      }));

      expect(routes).toContainEqual({ path: '/api/products', method: 'post' });
    });
  });

  describe('PUT /api/products/:idProduct', () => {
    it('should call updateProduct controller with the correct data', async () => {
      const idProduct = '607d1f77bcf86cd799439011';
      const mockRequestBody = { price: 150 };
      const mockResponse = { message: 'Product updated successfully' };

      productController.updateProduct.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put(`/api/products/${idProduct}`)
        .send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(productController.updateProduct).toHaveBeenCalled();
      expect(authorizeAdmin).toHaveBeenCalled();
      expect(validateProductCreation).toHaveBeenCalled();
    });

    it('should define the PUT /api/products/:idProduct route', () => {
      const routes = router.stack.map((layer) => ({
        path: layer.route?.path,
        method: layer.route?.stack[0]?.method,
      }));

      expect(routes).toContainEqual({ path: '/api/products/:idProduct', method: 'put' });
    });
  });

  describe('GET /api/products', () => {
    it('should call getProducts controller with the correct query params', async () => {
      const mockResponse = [{ name: 'Product A', price: 100 }];

      productController.getProducts.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/api/products')
        .query({ price: 100 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(productController.getProducts).toHaveBeenCalled();
      expect(validateQueryParamsProduct).toHaveBeenCalled();
    });

    it('should define the GET /api/products route', () => {
      const routes = router.stack.map((layer) => ({
        path: layer.route?.path,
        method: layer.route?.stack[0]?.method,
      }));

      expect(routes).toContainEqual({ path: '/api/products', method: 'get' });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should call deleteProduct controller with the correct ID', async () => {
      const id = '607d1f77bcf86cd799439011';
      const mockResponse = { message: 'Product deleted successfully' };

      productController.deleteProduct.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete(`/api/products/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(productController.deleteProduct).toHaveBeenCalled();
      expect(authorizeAdmin).toHaveBeenCalled();
    });

    it('should define the DELETE /api/products/:id route', () => {
      const routes = router.stack.map((layer) => ({
        path: layer.route?.path,
        method: layer.route?.stack[0]?.method,
      }));

      expect(routes).toContainEqual({ path: '/api/products/:id', method: 'delete' });
    });
  });
});
