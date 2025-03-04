import { register } from '../controllers/userController';
import User from '../models/User';

jest.mock('../models/User');

describe('User Controller', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          age: 30,
          avatar: 'avatar.jpg',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue({
        _id: 'userId',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        age: 30,
        registrationDate: new Date(),
        avatar: 'avatar.jpg',
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario registrado exitosamente',
        user: {
          id: 'userId',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
          age: 30,
          registrationDate: expect.any(Date),
          avatar: 'avatar.jpg',
        },
      });
    });

    it('should handle errors', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = 'Error al registrar usuario';
      User.findOne.mockRejectedValue(new Error(errorMessage));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al registrar usuario',
        error: errorMessage,
      });
    });
  });
});