import * as recipesServices from '../services/recipesServices.js';
import { toController } from '../utils/api.js';

const getRecipes = async (req, res) => {
  const {
    page: _page = 1,
    limit: _limit = 10,
    category = null,
    area = null,
  } = req.query;
  const page = Number(_page);
  const limit = Number(_limit);

  const [recipes, totalRecipes] = await Promise.all([
    recipesServices.getRecipes({
      page,
      limit,
      category,
      area,
    }),
    recipesServices.getAllRecipesCount(),
  ]);

  res.status(200).json({
    recipes,
    page,
    total: totalRecipes,
  });
};

export default {
  getRecipes: toController(getRecipes),
};
