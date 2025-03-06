import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Race from '../models/Race.js';
import Registration from '../models/Registrations.js';
import {
  getAllRaces,
  getRacesBySport,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  getRacesByDate,
  getRacesByLocation,
  registerRaceResults,
  getRaceResults,
  downloadRunnersCSV,
  uploadResultsCSV
} from '../controllers/raceController.js';

describe('Race Controller Tests', () => {
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

  describe('getAllRaces', () => {
    it('debería obtener todas las carreras con paginación', async () => {
      const mockRaces = [
        { name: 'Carrera 1', sport: 'running' },
        { name: 'Carrera 2', sport: 'cycling' }
      ];

      req = {
        query: {
          page: 1,
          limit: 10
        }
      };

      sinon.stub(Race, 'find').returns({
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        sort: sinon.stub().resolves(mockRaces)
      });

      sinon.stub(Race, 'countDocuments').resolves(2);

      await getAllRaces(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.firstCall.args[0]).to.have.property('races');
      expect(jsonStub.firstCall.args[0]).to.have.property('pagination');
    });

    it('debería validar parámetros de paginación', async () => {
      req = {
        query: {
          page: 0,
          limit: -1
        }
      };

      await getAllRaces(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Los parámetros de paginación deben ser números positivos'
      })).to.be.true;
    });
  });

  describe('getRacesBySport', () => {
    it('debería validar deporte inválido', async () => {
      req = {
        params: { sport: 'invalid' },
        query: { page: '1', limit: '10' }
      };

      await getRacesBySport(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling'
      })).to.be.true;
    });
  });

  describe('createRace', () => {
    it('debería crear una carrera exitosamente', async () => {
      const mockRace = {
        name: 'Nueva Carrera',
        sport: 'running',
        date: '2024-12-31',
        location: 'Ciudad Test',
        distance: 10,
        maxParticipants: 100,
        unevenness: 200,
        tour: 'Ruta test',
        qualifyingTime: '01:00:00'
      };

      req = {
        body: mockRace,
        user: { role: 'admin' }
      };

      const savedRace = { ...mockRace, _id: 'race123' };
      sinon.stub(Race.prototype, 'save').resolves(savedRace);

      await createRace(req, res);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Carrera creada exitosamente',
        race: savedRace
      })).to.be.true;
    });
  });

  describe('registerRaceResults', () => {
    it('debería registrar resultados exitosamente', async () => {
      const mockRegistration = {
        _id: 'reg123',
        save: sinon.stub().resolves()
      };

      req = {
        params: { raceId: 'race123' },
        body: {
          registrationId: 'reg123',
          finishTime: '02:30:00',
          position: 1
        },
        user: { role: 'admin' }
      };

      sinon.stub(mongoose.Types.ObjectId, 'isValid').returns(true);
      sinon.stub(Race, 'findById').resolves({ _id: 'race123' });
      sinon.stub(Registration, 'findById').resolves(mockRegistration);

      await registerRaceResults(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Resultados registrados exitosamente'
      })).to.be.true;
    });

    it('debería validar formato de tiempo', async () => {
      req = {
        params: { raceId: 'race123' },
        body: {
          registrationId: 'reg123',
          finishTime: 'tiempo_invalido',
          position: 1
        },
        user: { role: 'admin' }
      };

      await registerRaceResults(req, res);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({
        message: 'Formato de tiempo inválido. Debe ser HH:mm:ss'
      })).to.be.true;
    });
  });

  describe('getRaceResults', () => {
    it('debería obtener resultados de una carrera', async () => {
      const mockResults = [
        {
          userId: { name: 'Usuario 1' },
          finishTime: '02:30:00',
          position: 1
        }
      ];

      req = {
        params: { raceId: 'race123' }
      };

      sinon.stub(Registration, 'find').returns({
        populate: sinon.stub().resolves(mockResults)
      });

      await getRaceResults(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.firstCall.args[0]).to.have.property('results');
    });
  });
});