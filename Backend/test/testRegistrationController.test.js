import { createRegistration } from '../controllers/registrationController';
import Registration from '../models/Registrations';
import Race from '../models/Race';
import User from '../models/User';

jest.mock('../models/Registrations');
jest.mock('../models/Race');
jest.mock('../models/User');

describe('Registration Controller', () => {
  describe('createRegistration', () => {
    it('should create a new registration', async () => {
      const req = {
        body: { race: 'raceId' },
        user: { id: 'userId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const race = {
        _id: 'raceId',
        status: 'open',
        maxParticipants: 100,
        participants: 50,
      };

      Race.findById.mockResolvedValue(race);
      Registration.findOne.mockResolvedValue(null);
      Registration.prototype.save.mockResolvedValue({
        _id: 'registrationId',
        race: 'raceId',
        user: 'userId',
        status: 'registered',
        registeredAt: new Date(),
      });

      await createRegistration(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'registrationId',
        race: 'raceId',
        user: 'userId',
        status: 'registered',
        registeredAt: expect.any(Date),
      });
    });

    it('should handle errors', async () => {
      const req = {
        body: { race: 'raceId' },
        user: { id: 'userId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = 'Error al crear la inscripción';
      Race.findById.mockRejectedValue(new Error(errorMessage));

      await createRegistration(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error en la conexión al endpoint',
        error: errorMessage,
      });
    });
  });
});