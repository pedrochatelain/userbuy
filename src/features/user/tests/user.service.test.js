const bcrypt = require('bcryptjs');
const {
    createUser,
    getUsers,
    editRoles,
    addToBalances,
    deleteUser
} = require('../user.service');
const datasource = require('../user.datasource');
const { UserNotFound } = require('../../../errors/customErrors');
const hashPassword = require('../../../utils/hashPassword')
const userService = require('../user.service');

jest.mock('../../../utils/hashPassword');
jest.mock('bcryptjs');
jest.mock('../user.datasource');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should fetch all users from the datasource', async () => {
            const users = [{ username: 'user1' }, { username: 'user2' }];
            datasource.getActiveUsers.mockResolvedValue(users); // Fix: Align with service implementation

            const result = await getUsers();

            expect(result).toEqual(users);
            expect(datasource.getActiveUsers).toHaveBeenCalled(); // Fix: Ensure correct mock verification
        });
    });

    describe('createUser', () => {
        it('should hash the password and create a user', async () => {
            // Arrange
            const mockUser = {
                username: 'testuser',
                password: 'plainPassword123',
                email: 'test@example.com',
                role: 'admin'
            };

            const hashedPassword = 'hashedPassword123';
            const expectedUser = {
                ...mockUser,
                password: hashedPassword,
                role: 'ADMIN'
            };

            const createdUser = {
                id: 1,
                ...expectedUser,
                createdAt: new Date()
            };

            // Mock the hashPassword function
            hashPassword.mockResolvedValue(hashedPassword);
            
            // Mock the datasource createUser method
            datasource.createUser.mockResolvedValue(createdUser);

            // Act
            const result = await userService.createUser(mockUser);

            // Assert
            expect(hashPassword).toHaveBeenCalledWith('plainPassword123');
            expect(hashPassword).toHaveBeenCalledTimes(1);
            
            expect(datasource.createUser).toHaveBeenCalledWith(expectedUser);
            expect(datasource.createUser).toHaveBeenCalledTimes(1);
            
            expect(result).toEqual(createdUser);
        });

        it('should return null if creation fails', async () => {
            datasource.createUser.mockRejectedValue(new Error('DB error')); // Fix: Align with actual error handling

            const result = await createUser({ username: 'testuser', password: 'password123' });

            expect(result).toBeNull();
            expect(datasource.createUser).toHaveBeenCalled();
        });
    });

    describe('editRoles', () => {
        it('should edit user roles successfully', async () => {
            const idUser = '123';
            const roles = ['ADMIN'];
            const updatedUser = { _id: idUser, role: roles };

            datasource.updateUserRole.mockResolvedValue({});
            datasource.getUser.mockResolvedValue(updatedUser);

            const result = await editRoles(idUser, roles);

            expect(datasource.updateUserRole).toHaveBeenCalledWith(idUser, roles);
            expect(datasource.getUser).toHaveBeenCalledWith(idUser);
            expect(result).toEqual(updatedUser);
        });

        it('should throw an error if update fails', async () => {
            const idUser = '123';
            const roles = ['ADMIN'];

            datasource.updateUserRole.mockRejectedValue(new Error('Update failed'));

            await expect(editRoles(idUser, roles)).rejects.toThrow('Update failed');
        });
    });

    describe('addToBalances', () => {
        it('should add amount to user balances successfully', async () => {
            const idUser = '123';
            const amount = 100;
            const user = { _id: idUser, balances: 200 };

            datasource.existsUser.mockResolvedValue(true);
            datasource.addToBalances.mockResolvedValue({});
            datasource.getUser.mockResolvedValue(user);

            const result = await addToBalances(idUser, amount);

            expect(datasource.existsUser).toHaveBeenCalledWith(idUser);
            expect(datasource.addToBalances).toHaveBeenCalledWith(idUser, amount);
            expect(result).toEqual(user);
        });

        it('should throw UserNotFound if user does not exist', async () => {
            datasource.existsUser.mockResolvedValue(false);

            await expect(addToBalances('123', 100)).rejects.toThrow(UserNotFound);
        });
    });

    describe('deleteUser', () => {
        it('should mark user as deleted successfully', async () => {
            const idUser = '123';
            const deletedUser = { _id: idUser, isDeleted: true };

            datasource.existsUser.mockResolvedValue(true);
            datasource.deleteUser.mockResolvedValue(deletedUser);

            const result = await deleteUser(idUser);

            expect(datasource.existsUser).toHaveBeenCalledWith(idUser);
            expect(datasource.deleteUser).toHaveBeenCalledWith(idUser);
            expect(result).toEqual(deletedUser);
        });

        it('should throw UserNotFound if user does not exist', async () => {
            datasource.existsUser.mockResolvedValue(false);

            await expect(deleteUser('123')).rejects.toThrow(UserNotFound);
        });
    });
});
