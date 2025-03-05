import { getAllRaces } from '../controllers/raceController';
import Race from '../models/Race';

jest.mock('../models/Race');

describe('Race Controller', () => {
  describe('getAllRaces', () => {
    it('should return all races', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const races = [
        { name: 'Race 1', status: 'active' },
        { name: 'Race 2', status: 'active' },
      ];

      Race.find.mockResolvedValue(races);

      await getAllRaces(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(races);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = 'Error al obtener las carreras';
      Race.find.mockRejectedValue(new Error(errorMessage));

      await getAllRaces(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error en la conexión al endpoint',
        error: errorMessage,
      });
    });
  });
});