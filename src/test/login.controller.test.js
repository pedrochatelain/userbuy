const { login } = require('../features/login/login.controller');
const service = require('../features/login/login.service');

jest.mock('../features/login/login.service');

describe('Login Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: { username: 'testuser', password: 'password123' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 200 and login result on successful login', async () => {
        const mockResult = { token: 'fake-jwt-token', user: { id: 1, username: 'testuser' } };
        service.login.mockResolvedValue(mockResult);

        await login(mockReq, mockRes);

        expect(service.login).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return error status and message on login failure', async () => {
        const mockError = { statusCode: 401, message: 'Invalid credentials' };
        service.login.mockRejectedValue(mockError);

        await login(mockReq, mockRes);

        expect(service.login).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(mockError.statusCode);
        expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
