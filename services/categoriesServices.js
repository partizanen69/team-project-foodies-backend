import Category from '../db/category.model.js';

async function listCategories(searchOptions = {}) {
  const { filter = {}, fields = '', settings = {} } = searchOptions;
  const result = await Category.find(filter, fields, settings);
  return result;
}

const categoriesServices = {
  listCategories,
};

export default categoriesServices;
