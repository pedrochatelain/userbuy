const request = require('supertest');
const express = require('express');
const router = require('../purchase.routes');
const purchaseController = require('../purchase.controller');
const validateUserAccess = require('../../../middlewares/validateUserAccess');
const validatePurchaseDeletion = require('../../../middlewares/validatePurchaseDeletion');

jest.mock('../purchase.controller');
jest.mock('../../../middlewares/validateUserAccess', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/validatePurchaseDeletion', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use(router);

describe('Purchase Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/purchases', () => {
    it('should call addPurchase controller method', async () => {
      purchaseController.addPurchase.mockImplementation((req, res) =>
        res.status(201).json({ message: 'Purchase added' })
      );

      const response = await request(app).post('/api/purchases').send({
        idUser: '64e3a9f8f8d4f2b4baccafff',
        product: { name: 'Laptop', price: 1000 },
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Purchase added' });
      expect(purchaseController.addPurchase).toHaveBeenCalled();
    });
  });

  describe('GET /api/purchases', () => {
    it('should call getPurchases controller method', async () => {
      purchaseController.getPurchases.mockImplementation((req, res) =>
        res.status(200).json([{ idUser: '64e3a9f8f8d4f2b4baccafff', product: { price: 1000 } }])
      );

      const response = await request(app).get('/api/purchases');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ idUser: '64e3a9f8f8d4f2b4baccafff', product: { price: 1000 } }]);
      expect(purchaseController.getPurchases).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:idUser/purchases', () => {
    it('should validate user access and call getPurchasesUser controller method', async () => {
      purchaseController.getPurchasesUser.mockImplementation((req, res) =>
        res.status(200).json([{ idUser: req.params.idUser, product: { price: 1000 } }])
      );

      const response = await request(app).get('/api/users/64e3a9f8f8d4f2b4baccafff/purchases');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ idUser: '64e3a9f8f8d4f2b4baccafff', product: { price: 1000 } }]);
      expect(validateUserAccess).toHaveBeenCalled();
      expect(purchaseController.getPurchasesUser).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/purchases/:idPurchase', () => {
    it('should validate purchase deletion and call deletePurchase controller method', async () => {
      purchaseController.deletePurchase.mockImplementation((req, res) =>
        res.status(200).json({ message: 'Purchase deleted' })
      );

      const response = await request(app).delete('/api/purchases/64e3b1a9f9d4f2c5baccb000');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Purchase deleted' });
      expect(validatePurchaseDeletion).toHaveBeenCalled();
      expect(purchaseController.deletePurchase).toHaveBeenCalled();
    });
  });
});
