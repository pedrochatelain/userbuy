const express = require('express');
const request = require('supertest');
const userRoutes = require('../user.routes');
const userController = require('../user.controller');
const validateUserCreation = require('../../../middlewares/validateUserCreation');
const validateRoleUpdate = require('../../../middlewares/validateRoleUpdate');
const handleValidationErrors = require('../../../middlewares/handleValidationErrors');
const validateUserAccess = require('../../../middlewares/validateUserAccess');
const validateUserOrAdmin = require('../../../middlewares/validateUserOrAdmin');
const validateObjectId = require('../../../middlewares/validateObjectId');
const authorizeAdmin = require('../../../middlewares/authorizeAdmin');

jest.mock('../user.controller');
jest.mock('../../../middlewares/validateUserCreation', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/validateRoleUpdate', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/handleValidationErrors', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/validateUserAccess', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/validateUserOrAdmin', () => jest.fn((req, res, next) => next()));
jest.mock('../../../middlewares/validateObjectId', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../middlewares/authorizeAdmin', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use(userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should call validateUserCreation middleware and createUser controller', async () => {
      userController.createUser.mockImplementation((req, res) =>
        res.status(200).json({ id: '1', name: 'John Doe', email: 'john.doe@example.com' })
      );

      const response = await request(app).post('/api/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      expect(validateUserCreation).toHaveBeenCalled();
      expect(userController.createUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', name: 'John Doe', email: 'john.doe@example.com' });
    });
  });

  describe('GET /api/users', () => {
    it('should call getUsers controller and return users', async () => {
      userController.getUsers.mockImplementation((req, res) =>
        res.status(200).json([{ id: '1', name: 'John Doe' }])
      );

      const response = await request(app).get('/api/users');

      expect(userController.getUsers).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: '1', name: 'John Doe' }]);
    });
  });

  describe('PATCH /api/users/:idUser/roles', () => {
    it('should call all middlewares and editRoles controller', async () => {
      userController.editRoles.mockImplementation((req, res) =>
        res.status(200).json({ idUser: req.params.idUser, roles: req.body.roles })
      );

      const response = await request(app)
        .patch('/api/users/64e3b1a9f9d4f2c5baccb000/roles')
        .send({ roles: ['ADMIN'] });

      expect(authorizeAdmin).toHaveBeenCalled();
      expect(validateObjectId).toHaveBeenCalledWith('idUser');
      expect(validateRoleUpdate).toHaveBeenCalled();
      expect(handleValidationErrors).toHaveBeenCalled();
      expect(userController.editRoles).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idUser: '64e3b1a9f9d4f2c5baccb000', roles: ['ADMIN'] });
    });
  });

  describe('PATCH /api/users/:idUser/balances', () => {
    it('should call middlewares and addToBalances controller', async () => {
      userController.addToBalances.mockImplementation((req, res) =>
        res.status(200).json({ idUser: req.params.idUser, balance: req.body.balance })
      );

      const response = await request(app)
        .patch('/api/users/64e3b1a9f9d4f2c5baccb000/balances')
        .send({ balance: 1000 });

      expect(validateObjectId).toHaveBeenCalledWith('idUser');
      expect(validateUserAccess).toHaveBeenCalled();
      expect(userController.addToBalances).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idUser: '64e3b1a9f9d4f2c5baccb000', balance: 1000 });
    });
  });

  describe('DELETE /api/users/:idUser', () => {
    it('should call middlewares and deleteUser controller', async () => {
      userController.deleteUser.mockImplementation((req, res) =>
        res.status(200).json({ message: 'User deleted', idUser: req.params.idUser })
      );

      const response = await request(app).delete('/api/users/64e3b1a9f9d4f2c5baccb000');

      expect(validateObjectId).toHaveBeenCalledWith('idUser');
      expect(validateUserOrAdmin).toHaveBeenCalled();
      expect(userController.deleteUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted', idUser: '64e3b1a9f9d4f2c5baccb000' });
    });
  });
});
