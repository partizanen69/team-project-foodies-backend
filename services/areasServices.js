import Area from '../db/area.model.js';

async function listAreas(searchOptions = {}) {
  const { filter = {}, fields = '', settings = {} } = searchOptions;
  const result = await Area.find(filter, fields, settings);
  return result;
}

const areasServices = {
  listAreas,
};

export default areasServices;
