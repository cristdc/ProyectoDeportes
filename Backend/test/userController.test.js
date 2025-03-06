import { expect, sinon } from './setup.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  login,
  register,
  logout,
  getUserProfile,
  updateProfile,
  getUserById,
  searchUsersByName
} from '../controllers/userController.js';

describe('User Controller Tests', () => {
  let req, res, statusStub, jsonStub;

  beforeEach(() => {
    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      json: jsonStub,
      status: statusStub.returns({ json: jsonStub }),
      cookie: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('debería realizar login exitosamente', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        name: 'Test User',
        role: 'user',
        comparePassword: sinon.stub().resolves(true)
      };

      req = {
        body: {
          email: 'test@test.com',
          password: 'password123'
        }
      };

      sinon.stub(User, 'findOne').resolves(mockUser);
      sinon.stub(jwt, 'sign').returns('mock-token');

      await login(req, res);

      expect(res.cookie.calledWith('token')).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Inicio de sesión exitoso',
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        }
      })).to.be.true;
    });

    it('debería fallar si faltan credenciales', async () => {
      req = { body: {} };

      await login(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Se requiere email y contraseña'
      })).to.be.true;
    });
  });

  describe('register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const mockUser = {
        _id: '123',
        email: 'nuevo@test.com',
        name: 'Nuevo Usuario',
        role: 'user',
        age: 25,
        gender: 'M',
        save: sinon.stub().resolves()
      };

      req = {
        body: {
          email: 'nuevo@test.com',
          password: 'password123',
          name: 'Nuevo Usuario',
          age: 25,
          gender: 'M'
        }
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User.prototype, 'save').resolves(mockUser);

      await register(req, res);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Usuario registrado exitosamente',
        user: sinon.match.object
      })).to.be.true;
    });

    it('debería validar email duplicado', async () => {
      req = {
        body: {
          email: 'existente@test.com',
          password: 'password123',
          name: 'Usuario',
          gender: 'M'
        }
      };

      sinon.stub(User, 'findOne').resolves({ email: 'existente@test.com' });

      await register(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'El usuario ya existe'
      })).to.be.true;
    });
  });

  describe('getUserProfile', () => {
    it('debería obtener el perfil del usuario autenticado', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@test.com'
      };

      req = {
        user: { id: '123' }
      };

      sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(mockUser)
      });

      await getUserProfile(req, res);

      expect(jsonStub.calledWith(mockUser)).to.be.true;
    });

    it('debería manejar usuario no encontrado', async () => {
      req = {
        user: { id: 'noexiste' }
      };

      sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(null)
      });

      await getUserProfile(req, res);

      expect(statusStub.calledWith(404)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Usuario no encontrado'
      })).to.be.true;
    });
  });

  describe('searchUsersByName', () => {
    it('debería buscar usuarios por nombre con paginación', async () => {
      const mockUsers = [
        { name: 'Usuario 1' },
        { name: 'Usuario 2' }
      ];

      req = {
        query: {
          name: 'Usuario',
          page: 1,
          limit: 10
        }
      };

      sinon.stub(User, 'countDocuments').resolves(2);
      sinon.stub(User, 'find').returns({
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().resolves(mockUsers)
      });

      await searchUsersByName(req, res);

      expect(jsonStub.calledOnce).to.be.true;
      const response = jsonStub.firstCall.args[0];
      expect(response.users).to.deep.equal(mockUsers);
      expect(response.pagination).to.exist;
    });

    it('debería validar parámetros de paginación', async () => {
      req = {
        query: {
          name: 'Usuario',
          page: 0,
          limit: -1
        }
      };

      await searchUsersByName(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Los parámetros de paginación deben ser números positivos'
      })).to.be.true;
    });
  });

  describe('logout', () => {
    it('debería cerrar sesión exitosamente', async () => {
      await logout(req, res);

      expect(res.cookie.calledWith('token', '')).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Cierre de sesión exitoso'
      })).to.be.true;
    });
  });
});