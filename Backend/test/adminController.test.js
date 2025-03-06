import { expect, sinon } from './setup.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Race from '../models/Race.js';
import Registration from '../models/Registrations.js';
import {
  getAllUsers,
  getUserById,
  getUsersByName,
  updateUser,
  deleteUser,
  changeUserRole,
  getSystemStats
} from '../controllers/adminController.js';

describe('Admin Controller Tests', () => {
  let req, res, statusStub, jsonStub;

  beforeEach(() => {
    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      json: jsonStub,
      status: statusStub.returns({ json: jsonStub })
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios exitosamente', async () => {
      const usuarios = [
        { _id: '1', name: 'Usuario 1' },
        { _id: '2', name: 'Usuario 2' }
      ];
      const findStub = sinon.stub(User, 'find').returns({
        select: sinon.stub().resolves(usuarios)
      });

      await getAllUsers(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(jsonStub.calledWith(usuarios)).to.be.true;
    });

    it('debería manejar errores al obtener usuarios', async () => {
      const error = new Error('Error de base de datos');
      sinon.stub(User, 'find').throws(error);

      await getAllUsers(req, res);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Error al obtener todos los usuarios',
        error: error.message
      })).to.be.true;
    });
  });

  describe('getUserById', () => {
    it('debería obtener un usuario por ID exitosamente', async () => {
      const usuario = { _id: '1', name: 'Usuario 1' };
      req = { params: { id: '1' } };
      
      const findByIdStub = sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(usuario)
      });

      await getUserById(req, res);

      expect(findByIdStub.calledWith(req.params.id)).to.be.true;
      expect(jsonStub.calledWith(usuario)).to.be.true;
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      req = { params: { id: 'idInexistente' } };
      
      sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(null)
      });

      await getUserById(req, res);

      expect(statusStub.calledWith(404)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });
  });

  describe('changeUserRole', () => {
    it('debería cambiar el rol del usuario exitosamente', async () => {
      const usuario = { _id: '1', name: 'Usuario 1', role: 'admin' };
      req = { body: { userId: '1', role: 'admin' } };
      
      const findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').returns({
        select: sinon.stub().resolves(usuario)
      });

      await changeUserRole(req, res);

      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Rol actualizado correctamente',
        user: usuario
      })).to.be.true;
    });

    it('debería validar roles inválidos', async () => {
      req = { body: { userId: '1', role: 'rolInvalido' } };

      await changeUserRole(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Rol inválido' })).to.be.true;
    });
  });

  describe('getSystemStats', () => {
    it('debería obtener las estadísticas del sistema correctamente', async () => {
      const statsStubs = {
        users: sinon.stub(User, 'countDocuments'),
        races: sinon.stub(Race, 'countDocuments'),
        registrations: sinon.stub(Registration, 'countDocuments')
      };

      statsStubs.users.onCall(0).resolves(10); // total users
      statsStubs.users.onCall(1).resolves(2);  // admin users
      statsStubs.users.onCall(2).resolves(8);  // regular users
      
      statsStubs.races.onCall(0).resolves(5);  // running races
      statsStubs.races.onCall(1).resolves(3);  // trail running races
      statsStubs.races.onCall(2).resolves(4);  // cycling races
      statsStubs.races.onCall(3).resolves(7);  // open races
      statsStubs.races.onCall(4).resolves(3);  // finished races
      statsStubs.races.onCall(5).resolves(2);  // deleted races

      statsStubs.registrations.onCall(0).resolves(15); // registered
      statsStubs.registrations.onCall(1).resolves(10); // finished
      statsStubs.registrations.onCall(2).resolves(5);  // cancelled

      await getSystemStats(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledOnce).to.be.true;
      
      const expectedStats = {
        users: {
          total: 10,
          byRole: {
            admin: 2,
            regular: 8
          }
        },
        races: {
          bySport: {
            running: 5,
            trailRunning: 3,
            cycling: 4
          },
          byStatus: {
            open: 7,
            finished: 3,
            deleted: 2
          }
        },
        registrations: {
          registered: 15,
          finished: 10,
          cancelled: 5,
          total: 30
        }
      };

      expect(jsonStub.firstCall.args[0]).to.deep.equal(expectedStats);
    });
  });
});