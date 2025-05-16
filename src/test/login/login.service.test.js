const { login } = require('../../features/login/login.service');
const { getUserByUsername } = require('../../features/user/user.datasource');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserNotFound, InvalidCredentials, DeletedUser } = require('../../errors/customErrors');

jest.mock('../../features/user/user.datasource');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Login Service', () => {
    const mockUser = {
        _id: 'user-id',
        username: 'testuser',
        password: 'hashed-password',
        role: 'USER',
        isDeleted: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a token and user details on successful login', async () => {
        getUserByUsername.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('fake-jwt-token');

        const result = await login({ username: 'testuser', password: 'password123' });

        expect(getUserByUsername).toHaveBeenCalledWith('testuser');
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, username: mockUser.username, role: mockUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(result).toEqual({
            message: 'User logged in successfully',
            token: 'fake-jwt-token',
            user: mockUser,
        });
    });

    it('should throw UserNotFound error if user does not exist', async () => {
        getUserByUsername.mockResolvedValue(null);

        await expect(login({ username: 'unknown', password: 'password123' }))
            .rejects.toThrow(UserNotFound);

        expect(getUserByUsername).toHaveBeenCalledWith('unknown');
    });

    it('should throw InvalidCredentials error if password does not match', async () => {
        getUserByUsername.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(login({ username: 'testuser', password: 'wrongpassword' }))
            .rejects.toThrow(InvalidCredentials);

        expect(getUserByUsername).toHaveBeenCalledWith('testuser');
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed-password');
    });

    it('should throw DeletedUser error if the user is marked as deleted', async () => {
        // Mock user data with isDeleted set to true
        getUserByUsername.mockResolvedValue({ ...mockUser, isDeleted: true });
        
        // Mock bcrypt.compare to return true (password matches)
        bcrypt.compare.mockResolvedValue(true);

        await expect(login({ username: 'testuser', password: 'password123' }))
            .rejects.toThrow(DeletedUser);

        expect(getUserByUsername).toHaveBeenCalledWith('testuser');
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    });

});
