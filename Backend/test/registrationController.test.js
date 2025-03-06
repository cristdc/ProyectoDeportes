import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Registration from '../models/Registrations.js';
import Race from '../models/Race.js';
import User from '../models/User.js';
import {
  createRegistration,
  getUserRegistrations,
  getRaceRegistrations,
  updateRegistration,
  cancelRegistration,
  updateRegistrationTime,
  getAllRegistrations
} from '../controllers/registrationController.js';

describe('Registration Controller Tests', () => {
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

  describe('createRegistration', () => {
    it('debería crear una inscripción exitosamente', async () => {
      const mockRace = {
        _id: 'race123',
        status: 'open',
        maxParticipants: 100
      };
  
      const mockRegistration = {
        _id: 'reg123',
        race: 'race123',
        user: 'user123',
        status: 'registered'
      };
  
      req = {
        body: { raceId: 'race123' },
        user: { id: 'user123' }
      };
  
      sinon.stub(mongoose.Types.ObjectId, 'isValid').returns(true);
      sinon.stub(Race, 'findById').resolves(mockRace);
      sinon.stub(Registration, 'countDocuments').resolves(50);
      sinon.stub(Registration, 'findOne').resolves(null);
      sinon.stub(Registration.prototype, 'save').resolves(mockRegistration);
      
      // Corregir el stub de findById con populate
      const populateStub = sinon.stub();
      populateStub.withArgs('race', 'name date sport').returnsThis();
      populateStub.withArgs('user', 'name email').resolves(mockRegistration);
      
      sinon.stub(Registration, 'findById').returns({
        populate: populateStub
      });
  
      await createRegistration(req, res);
  
      expect(statusStub.calledWith(201)).to.be.true;
    });
  });

  describe('getRaceRegistrations', () => {
    it('debería obtener inscripciones de una carrera (admin)', async () => {
      const mockRace = {
        _id: 'race123',
        createdBy: 'admin123'
      };

      const mockRegistrations = [
        { _id: 'reg1', race: 'race123', user: 'user1' },
        { _id: 'reg2', race: 'race123', user: 'user2' }
      ];

      req = {
        params: { id: 'race123' },
        user: { id: 'admin123', role: 'admin' },
        query: { page: 1, limit: 10 }
      };

      sinon.stub(mongoose.Types.ObjectId, 'isValid').returns(true);
      sinon.stub(Race, 'findById').resolves(mockRace);
      sinon.stub(Registration, 'countDocuments').resolves(2);
      sinon.stub(Registration, 'find').returns({
        populate: sinon.stub().returnsThis(),
        sort: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().resolves(mockRegistrations)
      });

      await getRaceRegistrations(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.firstCall.args[0]).to.have.property('registrations');
    });

    it('debería validar permisos', async () => {
      const mockRace = {
        _id: 'race123',
        createdBy: 'admin123'
      };

      req = {
        params: { id: 'race123' },
        user: { id: 'user123', role: 'user' },
        query: {}
      };

      sinon.stub(mongoose.Types.ObjectId, 'isValid').returns(true);
      sinon.stub(Race, 'findById').resolves(mockRace);

      await getRaceRegistrations(req, res);

      expect(statusStub.calledWith(403)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'No tienes permisos para acceder a este recurso'
      })).to.be.true;
    });
  });

  describe('getUserRegistrations', () => {
    it('debería validar autenticación', async () => {
      req = {
        user: null,
        query: { page: '1', limit: '10' }
      };

      await getUserRegistrations(req, res);

      expect(statusStub.calledWith(401)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'No hay token de autenticación'
      })).to.be.true;
    });
  });

  describe('updateRegistration', () => {
    it('debería actualizar una inscripción (admin)', async () => {
      const mockRegistration = {
        _id: 'reg123',
        save: sinon.stub().resolves()
      };

      req = {
        params: { id: 'reg123' },
        body: { time: '02:30:00', position: 1 },
        user: { role: 'admin' }
      };

      sinon.stub(mongoose.Types.ObjectId, 'isValid').returns(true);
      const populateStub = sinon.stub().resolves(mockRegistration);
      sinon.stub(Registration, 'findById').returns({
        populate: () => ({ populate: populateStub })
      });

      await updateRegistration(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Inscripción actualizada exitosamente',
        registration: mockRegistration
      })).to.be.true;
    });
  });

  describe('cancelRegistration', () => {
    it('debería cancelar una inscripción', async () => {
      const mockRegistration = {
        _id: 'reg123',
        status: 'registered',
        save: sinon.stub().resolves(),
        user: 'user123'
      };

      req = {
        params: { id: 'reg123' },
        user: { id: 'user123' }
      };

      sinon.stub(mongoose.Types.ObjectId, 'isValid').returns(true);
      const populateStub = sinon.stub().resolves(mockRegistration);
      sinon.stub(Registration, 'findById').returns({
        populate: () => ({ populate: populateStub })
      });

      await cancelRegistration(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Inscripción cancelada exitosamente'
      })).to.be.true;
    });
  });
});