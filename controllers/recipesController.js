import recipesServices from '../services/recipesServices.js';
import { toController } from '../utils/api.js';

const getAllRecipes = async (req, res) => {
  const list = await recipesServices.recipeList();

  res.json({
    recepies: list,
  });
};

export default {
  getAllRecipes: toController(getAllRecipes),
};
