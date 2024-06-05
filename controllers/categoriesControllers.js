import categoriesServices from '../services/categoriesServices.js';
import { toController } from '../utils/api.js';

const getCategories = async (req, res, next) => {
  const fields = '-createdAt -updatedAt';

  const contacts = await categoriesServices.listCategories({
    fields,
  });

  res.status(200).json(contacts);
};

export default {
  getCategories: toController(getCategories),
};
