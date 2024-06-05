import areasServices from '../services/areasServices.js';
import { toController } from '../utils/api.js';

const getAreas = async (req, res, next) => {
  const fields = '-createdAt -updatedAt';
  const { page = 1, limit = 200 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };

  const areas = await areasServices.listAreas({
    fields,
    settings,
  });

  res.status(200).json(areas);
};

export default {
  getAreas: toController(getAreas),
};
