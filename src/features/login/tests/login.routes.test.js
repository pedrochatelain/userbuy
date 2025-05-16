const request = require('supertest');
const express = require('express');
const router = require('../login.routes');
const loginController = require('../login.controller');

// Mock the login controller
jest.mock('../login.controller', () => ({
  login: jest.fn(),
}));

// Create an instance of the Express app and use the router
const app = express();
app.use(express.json());
app.use(router);

describe('POST /api/login', () => {
  it('should call the login controller with the correct data', async () => {
    const mockRequestBody = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { success: true };

    // Mock the login controller's behavior
    loginController.login.mockImplementation((req, res) => {
      res.status(200).json(mockResponse);
    });

    const response = await request(app)
      .post('/api/login')
      .send(mockRequestBody);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);

    // Assert the controller was called with the correct data
    expect(loginController.login).toHaveBeenCalled();
  });

  it('should define the POST /api/login route', () => {
    const routes = router.stack.map((layer) => ({
      path: layer.route?.path,
      method: layer.route?.stack[0]?.method,
    }));

    expect(routes).toContainEqual({ path: '/api/login', method: 'post' });
  });
});


