import areasServices from '../services/areasServices.js';
import { toController, getPagination } from '../utils/api.js';
import { minusTimestamps } from '../utils/constants.js';

const getAreas = async (req, res, next) => {
  const areas = await areasServices.listAreas({
    fields: minusTimestamps,
    settings: getPagination(req.query),
  });

  res.status(200).json(areas);
};

export default {
  getAreas: toController(getAreas),
};
