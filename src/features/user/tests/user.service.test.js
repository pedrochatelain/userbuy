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

jest.mock('bcryptjs');
jest.mock('../user.datasource');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should fetch all users from the collection', async () => {
            const users = [{ username: 'user1' }, { username: 'user2' }];
            datasource.getUsersCollection.mockReturnValue({
                find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue(users) }),
            });

            const result = await getUsers();

            expect(result).toEqual(users);
            expect(datasource.getUsersCollection).toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should hash the password and create a user', async () => {
            const user = { username: 'testuser', password: 'password123', role: 'admin' };
            const hashedPassword = 'hashedPassword123';

            bcrypt.hash.mockResolvedValue(hashedPassword);
            const mockCollection = {
                insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
                findOne: jest.fn().mockResolvedValue({ ...user, _id: '123', password: hashedPassword, role: 'ADMIN' }),
            };
            datasource.getUsersCollection.mockResolvedValue(mockCollection);

            const result = await createUser(user);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockCollection.insertOne).toHaveBeenCalledWith({
                username: 'testuser',
                password: hashedPassword,
                role: 'ADMIN', // Updated to match the transformed role
            });
            expect(result).toEqual({ ...user, _id: '123', password: hashedPassword, role: 'ADMIN' });
        });


        it('should return null if creation fails', async () => {
            datasource.getUsersCollection.mockRejectedValue(new Error('DB error'));

            const result = await createUser({ username: 'testuser', password: 'password123' });

            expect(result).toBeNull();
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
