const {
    getUsersCollection,
    existsUser,
    getUserByUsername,
    getUser,
    updateUserRole,
    addToBalances,
    deleteUser
} = require('../user.datasource.js');

const { getDb } = require('../../../config/database.mongodb.js');
const { ObjectId } = require('mongodb');
const { UserNotFound } = require('../../../errors/customErrors');

jest.mock('../../../config/database.mongodb.js', () => ({
    getDb: jest.fn(),
}));

describe('User Datasource', () => {
    let mockCollection;

    beforeEach(() => {
        mockCollection = {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
        };

        getDb.mockReturnValue({
            collection: jest.fn(() => mockCollection),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUser', () => {
        it('should return null if idUser is invalid', async () => {
            const result = await getUser('invalid_id');
            expect(result).toBeNull();
        });

        it('should fetch user by ID', async () => {
            const user = { _id: new ObjectId(), username: 'testuser' };
            mockCollection.findOne.mockResolvedValueOnce(user);

            const result = await getUser(user._id.toString());

            expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: user._id });
            expect(result).toEqual(user);
        });

        it('should return null if fetching fails', async () => {
            mockCollection.findOne.mockRejectedValueOnce(new Error('Database error'));

            const result = await getUser(new ObjectId().toString());

            expect(result).toBeNull();
        });
    });

    describe('getUserByUsername', () => {
        it('should fetch user by username', async () => {
            const user = { username: 'testuser' };
            mockCollection.findOne.mockResolvedValueOnce(user);

            const result = await getUserByUsername('testuser');

            expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(result).toEqual(user);
        });

        it('should return null if fetching fails', async () => {
            mockCollection.findOne.mockRejectedValueOnce(new Error('Database error'));

            const result = await getUserByUsername('testuser');

            expect(result).toBeNull();
        });
    });

    describe('existsUser', () => {
        it('should return true if user exists', async () => {
            mockCollection.findOne.mockResolvedValueOnce({});

            const result = await existsUser(new ObjectId().toString());

            expect(result).toBe(true);
        });

        it('should return false if user does not exist', async () => {
            mockCollection.findOne.mockResolvedValueOnce(null);

            const result = await existsUser(new ObjectId().toString());

            expect(result).toBe(false);
        });
    });

    describe('updateUserRole', () => {
        it('should update user roles', async () => {
            mockCollection.updateOne.mockResolvedValueOnce({ matchedCount: 1 });

            const result = await updateUserRole(new ObjectId().toString(), ['ADMIN']);

            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { _id: expect.any(ObjectId) },
                { $set: { role: ['ADMIN'] } }
            );
            expect(result).toEqual({ matchedCount: 1 });
        });

        it('should throw UserNotFound if no user matches', async () => {
            mockCollection.updateOne.mockResolvedValueOnce({ matchedCount: 0 });

            await expect(
                updateUserRole(new ObjectId().toString(), ['ADMIN'])
            ).rejects.toThrow(UserNotFound);
        });
    });

    describe('addToBalances', () => {
        it('should update user balances', async () => {
            mockCollection.updateOne.mockResolvedValueOnce({});

            await addToBalances(new ObjectId().toString(), 100);

            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { _id: expect.any(ObjectId) },
                { $inc: { balances: 100 } },
                {}
            );
        });

        it('should throw an error if updating fails', async () => {
            mockCollection.updateOne.mockRejectedValueOnce(new Error('Update failed'));

            await expect(
                addToBalances(new ObjectId().toString(), 100)
            ).rejects.toThrow('Update failed');
        });
    });

    describe('deleteUser', () => {
        it('should mark user as deleted', async () => {
            const updatedUser = { _id: new ObjectId(), isDeleted: true };
            mockCollection.findOneAndUpdate.mockResolvedValueOnce({ value: updatedUser });

            const result = await deleteUser(updatedUser._id.toString());

            expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: expect.any(ObjectId) },
                { $set: { isDeleted: true } },
                { returnDocument: 'after' }
            );
            expect(result).toEqual({ value: updatedUser });
        });

        it('should handle errors when deleting a user', async () => {
            mockCollection.findOneAndUpdate.mockRejectedValueOnce(new Error('Delete failed'));

            await expect(
                deleteUser(new ObjectId().toString())
            ).rejects.toThrow('Delete failed');
        });
    });
});
