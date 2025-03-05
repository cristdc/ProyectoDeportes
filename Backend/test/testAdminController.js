import { getUserById } from '../controllers/adminController';
import User from '../models/User';

// filepath: /C:/Users/gdhug/Desktop/ProyectoDeportes/Backend/controllers/adminController.test.js

jest.mock('../models/User');

describe('getUserById', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return user if found', async () => {
    const user = { id: '123', name: 'John Doe' };
    User.findById.mockResolvedValue(user);

    await getUserById(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should return 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);

    await getUserById(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('should return 500 if there is an error', async () => {
    const error = new Error('Database error');
    User.findById.mockRejectedValue(error);

    await getUserById(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener el usuario', error: error.message });
  });
});