const { createUser, getUsers, editRoles, addToBalances, deleteUser } = require('../user.controller');
const service = require('../user.service');
const { validationResult } = require('express-validator');

jest.mock('../user.service');
jest.mock('express-validator', () => ({
    validationResult: jest.fn(),
}));

describe('user.controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should return validation errors if any', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: () => false, array: () => ['error'] });
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: ['error'] });
        });

        it('should create a user successfully', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: () => true });
            req.body = { name: 'Test User' };
            service.createUser.mockResolvedValueOnce(true);

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', user: { name: 'Test User' } });
        });

        it('should return an error if user creation fails', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: () => true });
            req.body = { name: 'Test User' };
            service.createUser.mockResolvedValueOnce(false);

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "couldn't create user" });
        });
    });

    describe('getUsers', () => {
        it('should fetch users successfully', async () => {
            service.getUsers.mockResolvedValueOnce([{ id: 1, name: 'User 1' }]);

            await getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'User 1' }]);
        });

        it('should handle errors when fetching users', async () => {
            service.getUsers.mockRejectedValueOnce(new Error('Database error'));

            await getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching users' });
        });
    });

    describe('editRoles', () => {
        it('should return validation errors if any', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: () => false, array: () => ['error'] });
            await editRoles(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: ['error'] });
        });

        it('should update user roles successfully', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: () => true });
            req.params.idUser = '123';
            req.body.role = ['ADMIN'];
            service.editRoles.mockResolvedValueOnce({ id: '123', roles: ['ADMIN'] });

            await editRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Role updated successfully', user: { id: '123', roles: ['ADMIN'] } });
        });

        it('should handle errors when updating roles', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: () => true });
            req.params.idUser = '123';
            req.body.role = ['ADMIN'];
            const error = new Error('Role update failed');
            error.statusCode = 400;
            service.editRoles.mockRejectedValueOnce(error);

            await editRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Role update failed' });
        });
    });

    describe('addToBalances', () => {
        it('should update balances successfully', async () => {
            req.params.idUser = '123';
            req.body.amount = 100;
            service.addToBalances.mockResolvedValueOnce({ success: true });

            await addToBalances(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User balances updated successfully', response: { success: true } });
        });

        it('should handle errors when updating balances', async () => {
            req.params.idUser = '123';
            req.body.amount = 100;
            const error = new Error('Balance update failed');
            error.statusCode = 400;
            service.addToBalances.mockRejectedValueOnce(error);

            await addToBalances(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Balance update failed' });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            req.params.idUser = '123';
            service.deleteUser.mockResolvedValueOnce({ id: '123' });

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully', deletedUser: { id: '123' } });
        });

        it('should handle errors when deleting a user', async () => {
            req.params.idUser = '123';
            const error = new Error('Delete failed');
            error.statusCode = 400;
            service.deleteUser.mockRejectedValueOnce(error);

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Delete failed' });
        });
    });
});
