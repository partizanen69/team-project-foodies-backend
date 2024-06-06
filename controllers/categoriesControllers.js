import categoriesServices from '../services/categoriesServices.js';
import { toController, getPagination } from '../utils/api.js';
import { minusTimestamps } from '../utils/constants.js';

const getCategories = async (req, res, next) => {
  const categories = await categoriesServices.listCategories({
    fields: minusTimestamps,
    settings: getPagination(req.query),
  });

  res.status(200).json(categories);
};

export default {
  getCategories: toController(getCategories),
};
